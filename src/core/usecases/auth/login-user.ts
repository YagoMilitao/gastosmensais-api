import {z} from "zod";
import type { UserRepository } from "../../ports/user-repository.js";
import  { unauthorized } from "../../../shared/errors/app-error.js";


const inputSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export class LoginUser{
    constructor(
        private users: UserRepository,
        private hasher:PasswordHasher,
        private tokens: TokenService
    ){}
    async execute(input: unknown): Promise<{token:string}>{
        const data = inputSchema.parse(input);
        const user = await this.users.findByEmail(data.email.toLocaleLowerCase());
        if (!user) {
            throw unauthorized("Invalid email or password");
        }
        const ok = await this.hasher.compare(data.password, user.password);
        if (!ok) {
            throw unauthorized("Invalid email or password");
        }
        const token = await this.tokens.generate({sub: user.id, email:user.email});
        return { token };
    }
}