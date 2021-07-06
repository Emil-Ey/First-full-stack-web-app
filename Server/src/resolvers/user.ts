import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Arg, Field, Ctx, Mutation, ObjectType, Query } from "type-graphql";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import UsernamePasswordInput from "../utils/usernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: []

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver() 
export class UserResolver {
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string, 
        @Arg('newPassword') newPassword: string,
        @Arg('newPassword1') newPassword1: string,
        @Ctx() { redis, em, req }:MyContext
    ) {
        // Check if passwords are the same
        if(newPassword != newPassword1 ) {
            return {
                errors: [
                    {
                        field: 'newPassword1',
                        message: "passwords are not identical",
                    },
                ],
            };
        }
        // Check if password is at least of length 3
        if(newPassword.length <= 3 ) {
            return {
                errors: [
                    {
                        field: 'newPassword',
                        message: "password must be at least 4 characters",
                    },
                ],
            };
        }

        const key = FORGET_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if(!userId) {
            return {
                errors: [
                    {
                        field: 'token',
                        message: "token expired",
                    },
                ],
            };
        }

        const user = await em.findOne(User, { id: parseInt(userId) });

        if(!user) {
            return {
                errors: [
                    {
                        field: 'token',
                        message: "user no longer exists",
                    },
                ],
            };
        }

        user.password = newPassword;
        await em.persistAndFlush(user);

        await redis.del(key);

        // Login user after changed password 
        req.session.userId = user.id;
        req.session.save();
        return { user }; 
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { em, redis }: MyContext,
    ) {
        const user = await em.findOne(User, {email: email})
        if(!user) {
            // Email not in the DB
            return true;
        }

        const token = v4();
        redis.set(
            FORGET_PASSWORD_PREFIX + token, 
            user.id, 
            'ex', 
            1000 * 60 * 60 * 24 * 2 // 2 days
        );

        sendEmail(
            email, 
            `<a href="http://localhost:3000/change-password/${token}">rest password</a>`
        );

        return true;
    }

    @Query(() => User, { nullable: true })
    async me(@Ctx() { em, req }: MyContext) {
        // You are not logged in
        if(!req.session.userId) {
            return null
        }

        const user = await em.findOne(User, { id: req.session.userId });    
        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ) {
        const errors = validateRegister(options);
        if(errors) {
            return { errors };
        }
        const user = em.create(User, {
            username: options.username,
            email: options.email,
            password: options.password,
        });

        try{
            await em.persistAndFlush(user);
        } catch(err) {
            if(err.code === '23505' && err.detail.includes(options.email)) {
                //duplicate email error
                return {
                    errors: [{
                        field: 'email',
                        message: "email already taken",
                    },],
                };
            }
            if(err.code === '23505' && err.detail.includes(options.username)) {
                //duplicate username error
                return {
                    errors: [{
                        field: 'username',
                        message: "username already taken",
                    },],
                };
            }
        }
        req.session.userId = user.id;
        req.session.save();
        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { em, req }: MyContext
    ) {
        const user = await em.findOne(
            User, 
            usernameOrEmail.includes('@') 
                ? {email: usernameOrEmail} 
                : {username: usernameOrEmail}
        );

        if (!user) {
            return {
                errors: [{
                    field: 'usernameOrEmail',
                    message: "username does not exist",
                },],
            };
        }

        if(user.password != password) {
            return {
                errors: [{
                    field: 'password',
                    message: "incorrect password",
                },],
            };
        }

        req.session.userId = user.id;
        req.session.save();
        return { user };
    }

    @Mutation(() => Boolean) 
    logout(@Ctx() { req, res }: MyContext) {
        return new Promise(resolve => req.session.destroy(err => {
            if(err) {
                console.log(err);
                resolve(false);
                return
            }
            res.clearCookie(COOKIE_NAME);
            resolve(true);
        }));
    }
}