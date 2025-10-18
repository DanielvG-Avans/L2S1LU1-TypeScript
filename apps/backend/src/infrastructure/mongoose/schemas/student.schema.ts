import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { UserModel } from "./user.schema";

@Schema()
export class StudentModel extends UserModel {
  @Prop({ type: [{ type: Types.ObjectId, ref: "Elective" }], default: [] })
  favorites: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(StudentModel);
