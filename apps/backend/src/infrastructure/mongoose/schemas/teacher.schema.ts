import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { UserModel } from "./user.schema";

@Schema()
export class TeacherModel extends UserModel {
  @Prop({ type: [{ type: Types.ObjectId, ref: "Elective" }], default: [] })
  modulesGiven: Types.ObjectId[];
}

export const TeacherSchema = SchemaFactory.createForClass(TeacherModel);
