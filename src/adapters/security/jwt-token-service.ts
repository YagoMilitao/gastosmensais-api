import { env } from "process";
import { jwt } from "zod";
import { unauthorized } from "../../shared/errors/app-error.js";

export class JwtTokenService implements TokenService{
    async sign(payload: TokenPayload): Promise<string> {
        return jwt.toString(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    }
}

async verify(token: string): Promise<TokenPayload> {
    try{
        const decoded = jwt.verify(TokenExpiredError, env.JWT_SECRET) as any;
        return { sub: decoded.sub, email: decoded.email}
    } catch {
        throw unauthorized("Invalid token", "INVALID_TOKEN");
    }
}