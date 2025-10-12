import { Module } from "src/domain/module/module";
import { Model, Types } from "mongoose";
import { ModuleModel, type ModuleDocument } from "../schemas/module.schema";
import { IModuleRepository } from "src/domain/module/module.repository.interface";
import { Injectable } from "@nestjs/common";

/**
 * A Mongoose-backed implementation of IModuleRepository.
 * Expects a Mongoose Model<Module & Document> to be injected.
 */
@Injectable()
export class MongooseModuleRepository implements IModuleRepository {
  constructor(private readonly model: Model<ModuleDocument>) {}

  async find(): Promise<Module[]> {
    const docs = await this.model.find().lean().exec();
    return docs.map((d) => this.toDomain(d));
  }

  async findById(id: string): Promise<Module | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).lean().exec();
    return doc ? this.toDomain(doc) : null;
  }

  async create(data: Module): Promise<Module> {
    const created = await this.model.create(data as unknown as ModuleModel);
    // fetch lean doc to normalize
    const doc = await this.model.findById(created._id).lean().exec();
    return this.toDomain(doc as any);
  }

  async update(id: string, data: Module): Promise<Module | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updated = await this.model
      .findByIdAndUpdate(id, data as unknown as Partial<ModuleModel>, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec();
    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const res = await this.model.findByIdAndDelete(id).exec();
    return res !== null;
  }

  private toDomain(doc: any): Module {
    if (!doc || typeof doc !== "object") return {} as Module;

    const { _id, __v, ...rest } = doc;
    return {
      ...rest,
      id: _id ? String(_id) : undefined,
    } as Module;
  }
}
