import { REPOSITORIES } from "../di-tokens";
import { MongooseModule } from "@nestjs/mongoose";
import { Module as NestModule } from "@nestjs/common";
import { UserSchema } from "./mongoose/schemas/user.schema";
import { MongooseUserRepository } from "./mongoose/repositories/mongoose-user.repository";
import { ModuleSchema } from "./mongoose/schemas/module.schema";
import { MongooseModuleRepository } from "./mongoose/repositories/mongoose-module.repository";

@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Module", schema: ModuleSchema },
    ]),
  ],
  providers: [
    { provide: REPOSITORIES.USER, useClass: MongooseUserRepository },
    { provide: REPOSITORIES.MODULE, useClass: MongooseModuleRepository },
  ],
  exports: [REPOSITORIES.USER, REPOSITORIES.MODULE],
})
export class InfrastructureModule {}
