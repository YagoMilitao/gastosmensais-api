import { email } from 'zod';
import { Collection, Db } from "mongodb";
import { UserRepository } from "../../../core/ports/user-repository";
import { User } from "../../../core/domain/user";
import type { UserDoc } from './types/UserDoc.js';



export class MongoUserRepository implements UserRepository {
    private col: Collection<UserDoc>;

    constructor(db: Db) {
        this.col = db.collection<UserDoc>('users');
        this.col.createIndex({ email:1 }, {unique: true}).catch(() => {});
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await this.col.findOne({ email });
        return doc ? this.toDomain(doc) : null;
    }

    async findById(id: string): Promise<User | null> {
        const doc = await this.col.findOne({ _id: id });
        return doc ? this.toDomain(doc) : null;
    }

    async create(user: User): Promise<void> {
        await this.col.insertOne({
            _id: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
            displayName: user.displayName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }

    private toDomain(doc: UserDoc): User {
        return {
            id: doc._id,
            email: doc.email,
            passwordHash: doc.passwordHash,
            displayName: doc.displayName,
            createdAt:doc.createdAt,
            updatedAt:doc.updatedAt
        };
    }
}