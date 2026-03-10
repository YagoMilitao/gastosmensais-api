import type { IncomingMessage } from "http";
import type { CreateExpense } from "../../../core/usecases/expenses/create-expense.js";
import type { ListExpenses } from "../../../core/usecases/expenses/list-expenses.js";
import { unauthorized } from "../../../shared/errors/app-error";
import { json } from "../presenters/http-response";

export class ExpenesesController {
    constructor(
        private createExpense: CreateExpense,
        private listExpenses: ListExpenses
    ){}
    create = async (req: IncomingMessage) => {
        if(!req.user){
            throw unauthorized("Unauthorized", "UNAUTHORIZED");
        }
        const body = await readJsonBody(req)
        const result = await this.createExpense.execute(
            req.user.id,
            ...body,
           
        )
        return json(201, result)
    
        }

        list = async (req: IncomingMessage) => {
            if(!req.user){
                throw unauthorized("Unauthorized", "UNAUTHORIZED");
            }
            const url = new URL(req.url || "", "http://localhost");
            const filters = Object.fromEntries(url.searchParams.entries());
            const result = await this.listExpenses.execute(req.user.id, filters)
            return json(200, {items: result})
        }
}