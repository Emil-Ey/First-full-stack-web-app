import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Arg, InputType, Field, Ctx, Mutation } from "type-graphql";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@Resolver() 
export class UserResolver {
    @Mutation(() => User)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ) {
        
        const user = em.create(User, {username: options.username, password: })
        await em.persistAndFlush(user);
        return 'bye';
}