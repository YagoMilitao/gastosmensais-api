import { z } from "zod";
import "dotenv/config";

const MILLISECONDS = 3000;

const envSchema = z.object({
    NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
    PORT: z.string().transform(Number).pipe(z.number().int().positive()).default(MILLISECONDS),
    MONGO_URL: z.string().min(1, "MONGO_URL is required"),
    JWT_SECRET: z.string().min(16, "JWT_SECTRET must be at least 16 characters"),
    JWT_EXPIRES_IN: z.string().default("7d"),
});
export const env = envSchema.parse(process.env);