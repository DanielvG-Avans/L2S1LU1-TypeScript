import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class TeacherModel {
  @Prop({ type: [{ type: Types.ObjectId, ref: "Elective" }], default: [] })
  modulesGiven: Types.ObjectId[];
}

export const TeacherSchema = SchemaFactory.createForClass(TeacherModel);
