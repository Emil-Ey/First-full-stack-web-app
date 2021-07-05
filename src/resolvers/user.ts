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
    @Mutation(() => String)
    register(
        @Arg()
    ) {
        return "hello world"
    }
}