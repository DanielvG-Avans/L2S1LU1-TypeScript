import { Module } from "@nestjs/common";
import { DbModule } from "./mongoose/db.module";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { UserSchema, type UserDocument } from "./mongoose/schemas/user.schema";
import { ModuleSchema, type ModuleDocument } from "./mongoose/schemas/module.schema";
import { USER_REPOSITORY, MODULE_REPOSITORY } from "./infrastructure.tokens";
import { MongooseUserRepository } from "./mongoose/repositories/mongoose-user.repository";
import { MongooseModuleRepository } from "./mongoose/repositories/mongoose-module.repository";
import { Model } from "mongoose";

@Module({
  // Initialize the database connection once for the whole app
  imports: [
    DbModule.forRoot(),
    // Register feature schemas so models can be injected via @InjectModel('User'|'Module')
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Module", schema: ModuleSchema },
    ]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      inject: [getModelToken("User")],
      useFactory: (userModel: Model<UserDocument>) => new MongooseUserRepository(userModel),
    },
    {
      provide: MODULE_REPOSITORY,
      inject: [getModelToken("Module")],
      useFactory: (moduleModel: Model<ModuleDocument>) =>
        new MongooseModuleRepository(moduleModel as any),
    },
  ],
  exports: [DbModule, MongooseModule, USER_REPOSITORY, MODULE_REPOSITORY],
})
export class InfrastructureModule {}
