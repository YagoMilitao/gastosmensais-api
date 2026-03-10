import { env } from "process";
import { JwtTokenService } from "./adapters/security/jwt-token-service.js";
import { LoginUser } from "./core/usecases/auth/login-user.js";
import { RegisterUser } from "./core/usecases/auth/register-user.js";
import { authMiddleware } from "./adapters/http/middleware/auth.js";

import { MongoConnection } from "./adapters/db/mongo/mongo-client";
import { MongoUserRepository } from "./adapters/db/mongo/user-repository.mongo";
import { MongoExpenseRepository } from "./adapters/db/mongo/expense-repository.mongo";
import { BcryptPasswordHasher } from "./adapters/security/bcrypt-password-hasher";
import { NodeIdGenerator } from "./adapters/security/node-id-generator";
import { SystemClock } from "./adapters/security/system-clock";
import { CreateExpense } from "./core/usecases/expenses/create-expense";
import { ListExpenses } from "./core/usecases/expenses/list-expenses";
//import Router  from "./adapters/http/router";
import { createServer } from "./adapters/http/server";

import { ExpensesController } from "./adapters/http/controllers/expenses.controller";
import { AuthController } from "./adapters/http/controllers/auth.controller.js";
import { Router } from "./adapters/http/router.js";

async function bootstrap(){
    const mongo = new MongoConnection(env.MONGO_URI, "gastosmensais");
    const db = await mongo.connect();
    const usersRepo = new MongoUserRepository(db);
    const expensesRepo = new MongoExpenseRepository(db);
    const hasher = new BcryptPasswordHasher(10);
    const tokens = new JwtTokenService();
    const ids = new NodeIdGenerator();
    const clock = new SystemClock();

    const registerUser = new RegisterUser(usersRepo, hasher, ids, clock);
    const loginUser = new LoginUser(usersRepo, hasher, tokens);
    const createExpense = new CreateExpense(expensesRepo, ids, clock);
    const listExpenses = new ListExpenses(expensesRepo);
    const authController = new AuthController(registerUser, loginUser);
    const expensesController = new ExpensesController(createExpense, listExpenses);

    const router = new Router();
    const requireAuth = authMiddleware(tokens);
    router.add("POST","/auth/register", async(req: any) => authController.register(req));
    router.add("POST","/auth/login", async(req: any) => authController.login(req));
    router.add("POST","/expenses", requireAuth, async(req: any) =>{
        await requireAuth(req);
        return expensesController.create(req);
     });
    router.add("GET","/expenses", requireAuth, async(req: any) => {
        await requireAuth(req);
        return expensesController.list(req);
     });

     const server = createServer(router);
     server.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
     })

     bootstrap().catch((e) =>{
        console.error(e)
        process.exit(1);
     })
   
}