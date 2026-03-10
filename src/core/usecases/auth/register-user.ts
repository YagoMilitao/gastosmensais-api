import {email, z} from "zod";
import type { UserRepository } from "../../ports/user-repository.js";
import { PasswordHasher } from "../../ports/password-hasher.js";
import { TokenService } from "../../ports/token-service.js";
import {badRequest, unauthorized} from "../../../shared/errors/app-error.js";

const inputSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    displayName: z.string().min(4).max(15).optional()
});

export class RegisterUser{
    constructor(
        private users:UserRepository,
        private hasher:PasswordHasher,
        private ids: IdGenerator,
        private clock: Clock
    ){}
    async execute(input: unknown): Promise<{id:string, email:string, displayName?:string}>{
        const data = inputSchema.parse(input);
        const existing = await this.users.findByEmail(data.email.toLocaleLowerCase());
        
        if (existing) {
            throw badRequest("Email already in use", "EMAIL_TAKEN");
        }

        const user: User = {
            id: this.ids.generate(),
            email: data.email.toLocaleLowerCase(),
            passwordHash: await this.hasher.hash(data.password),
            displayName: data.displayName,
            createdAt: this.clock.now()
        }
        await this.users.create(user);
        return {
            id: user.id,
            email: user.email,
            displayName: user.displayName
        };
    }
}