import { REPOSITORIES } from "../di-tokens";
import { MongooseModule } from "@nestjs/mongoose";
import { Module as NestModule } from "@nestjs/common";
import { UserSchema } from "./mongoose/schemas/user.schema";
import { MongooseUserRepository } from "./mongoose/repositories/mongoose-user.repository";

@NestModule({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  providers: [{ provide: REPOSITORIES.USER, useClass: MongooseUserRepository }],
  exports: [REPOSITORIES.USER],
})
export class InfrastructureModule {}
