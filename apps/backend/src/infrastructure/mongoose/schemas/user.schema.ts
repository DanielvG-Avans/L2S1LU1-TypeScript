import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ModuleModel } from "./module.schema";

export type UserDocument = HydratedDocument<UserModel>;

@Schema({ timestamps: true })
export class UserModel {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  passwordHash: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Module" }] })
  favorites: ModuleModel[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
