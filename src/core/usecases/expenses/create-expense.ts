export class CreateExpense {
    [x: string]: any;
    constructor(
        private expensesRepo: MongoExpenseRepository,
        private ids: NodeIdGenerator,
        private clock: SystemClock
    ){}
}