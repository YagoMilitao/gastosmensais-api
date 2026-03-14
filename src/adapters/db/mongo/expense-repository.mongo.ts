import { Collection, Db, Filter } from "mongodb";
import { ExpenseRepository } from "../../../core/ports/expense-repository";
import { Expense, ExpenseFilters } from "../../../core/domain/expense";
import type { ExpenseDoc } from "./types/ExpenseDoc.js";

export class MongoExpenseRepository implements ExpenseRepository {
    private col: Collection<ExpenseDoc>;
    constructor(db: Db) {
        this.col = db.collection<ExpenseDoc>('expenses');
        this.col.createIndex({ userId: 1, date: 1 }).catch(() => {});
    }

    async create(expense: Expense): Promise<void> {
        await this.col.insertOne({
            _id: expense.id,
            userId: expense.userId,
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            category: expense.category,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt
        });
    }
}