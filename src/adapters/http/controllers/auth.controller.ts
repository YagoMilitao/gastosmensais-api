
import type { IncomingMessage } from "node:http";
import { readJsonBody } from "../router";
import type { LoginUser } from "../../../core/usecases/auth/login-user.js";
import type { RegisterUser } from "../../../core/usecases/auth/register-user.js";
import { json } from "../presenters/http-response";


export class AuthController {
    constructor(private registerUser: RegisterUser, private loginUser: LoginUser){}

    register = async (req: IncomingMessage) => {
        const body = await readJsonBody(req)
        const result = await this.registerUser.execute(body)
        return json(201, result)
    };
    login = async (req: IncomingMessage) => {
        const body = await readJsonBody(req)
        const result = await this.loginUser.execute(body)
        return json(200, result)
    };
}