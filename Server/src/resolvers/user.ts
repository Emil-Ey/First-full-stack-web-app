import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Arg, InputType, Field, Ctx, Mutation, ObjectType, Query } from "type-graphql";
import { getConnection } from "typeorm";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

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
    @Query(() => User, { nullable: true })
    async me(@Ctx() { req, em }: MyContext) {
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
        @Ctx() { req }: MyContext
    ) {
        if(options.username.length <= 2 ) {
            return {
                errors: [{
                    field: 'username',
                    message: "username must be at least 2 characters",
                },],
            };
        }

        if(options.password.length <= 3 ) {
            return {
                errors: [{
                    field: 'password',
                    message: "password must be at least 4 characters",
                },],
            };
        }

        let user;

        try {
            const result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
                username: options.username,
                password: options.password,
            })
            .returning("*")
            .execute();
            user = result.raw[0];
        } catch(err) {
            if(err.code === '23505') {
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

        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ) {
        const user = await em.findOne(User, {username: options.username})
        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    message: "username does not exist",
                },],
            };
        }

        if(user.password != options.password) {
            return {
                errors: [{
                    field: 'password',
                    message: "incorrect password",
                },],
            };
        }

        req.session.userId = user.id;

        return { user };
    }
}