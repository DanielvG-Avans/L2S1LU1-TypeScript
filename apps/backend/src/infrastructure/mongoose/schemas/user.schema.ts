import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ElectiveModel } from "./elective.schema";

export type UserDocument = HydratedDocument<UserModel>;

@Schema({ timestamps: true })
export class UserModel {
  @Prop({ required: true, trim: true, minlength: 1, maxlength: 100 })
  firstName: string;

  @Prop({ required: true, trim: true, minlength: 1, maxlength: 100 })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email: string;

  @Prop({ required: true, enum: ["student", "teacher", "admin"] })
  role: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Elective" }], default: [] })
  favorites: ElectiveModel[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
