import { Model } from "mongoose";
import { Module as NestModule } from "@nestjs/common";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { REPOSITORIES } from "../di-tokens";
import { UserSchema, type UserDocument } from "./mongoose/schemas/user.schema";
import { ModuleSchema, type ModuleDocument } from "./mongoose/schemas/module.schema";
import { MongooseUserRepository } from "./mongoose/repositories/mongoose-user.repository";
import { MongooseModuleRepository } from "./mongoose/repositories/mongoose-module.repository";

const raw = process.env.DATABASE_URL ?? "";
const databaseUrl = raw.trim();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}
if (!databaseUrl.startsWith("mongodb://") && !databaseUrl.startsWith("mongodb+srv://")) {
  throw new Error("DATABASE_URL must start with 'mongodb://' or 'mongodb+srv://'");
}

@NestModule({
  // Initialize the database connection once for the whole app
  imports: [
    MongooseModule.forRoot(databaseUrl),
    // Register feature schemas so models can be injected via @InjectModel('User'|'Module')
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Module", schema: ModuleSchema },
    ]),
  ],
  providers: [
    {
      provide: REPOSITORIES.USER,
      inject: [getModelToken("User")],
      useFactory: (userModel: Model<UserDocument>) => new MongooseUserRepository(userModel),
    },
    {
      provide: REPOSITORIES.MODULE,
      inject: [getModelToken("Module")],
      useFactory: (moduleModel: Model<ModuleDocument>) => new MongooseModuleRepository(moduleModel),
    },
  ],
  exports: [MongooseModule, REPOSITORIES.USER, REPOSITORIES.MODULE],
})
export class InfrastructureModule {}
