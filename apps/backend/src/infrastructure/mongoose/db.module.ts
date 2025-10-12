import { Module, DynamicModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as dotenv from "dotenv";

// Ensure environment variables are loaded before evaluating connection settings
dotenv.config({ quiet: true });

@Module({})
export class DbModule {
  public static forRoot(): DynamicModule {
    const raw = process.env.DATABASE_URL ?? "";
    const databaseUrl = raw.trim();
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not defined");
    }
    if (!databaseUrl.startsWith("mongodb://") && !databaseUrl.startsWith("mongodb+srv://")) {
      throw new Error("DATABASE_URL must start with 'mongodb://' or 'mongodb+srv://'");
    }
    return {
      module: DbModule,
      imports: [MongooseModule.forRoot(databaseUrl)],
    };
  }
}
