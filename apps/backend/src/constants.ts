import * as dotenv from "dotenv";

dotenv.config({ quiet: true });

const jwtSecret: string = process.env.JWT_SECRET || "";
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const databaseUrl: string = process.env.DATABASE_URL || "";
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

export { jwtSecret, databaseUrl };
