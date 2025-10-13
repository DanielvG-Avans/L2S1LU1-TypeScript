import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ModuleDocument = HydratedDocument<ModuleModel>;

@Schema({ timestamps: true })
export class ModuleModel {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  provider: string;

  @Prop({ required: true })
  period: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  credits: number;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  level: string;

  @Prop({ type: [String], required: false })
  tags: string[];
}

export const ModuleSchema = SchemaFactory.createForClass(ModuleModel);
