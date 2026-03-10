import { unauthorized } from "../../../shared/errors/app-error.js";

export type AuthUser = {
    id: string;
    email: string;
}
declare module "http"{
    interface IncomingMessage{
        user?: AuthUser;
    }
}

export const authMiddleware = (tokens: TokenService)=> {
    return async (req: IncomingMessage) => {
        const header = req.headers["authorization"];
        if(!header || !header.startsWith("Bearer ")){
            throw unauthorized("Missing token or invalid Authorization header", "MISSING_TOKEN");
        }
        const token = header.slice("Bearer ".length);
        const payload = await tokens.verify(token);
        req.user = {
            id:payload.sub,
            email: payload.email
        }
    }
}