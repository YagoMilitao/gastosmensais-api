export type UserDoc= {
    _id:string;
    email:string;
    passwordHash: string;
    displayName?: string;
    createdAt: Date;
    updatedAt?: Date;
}