import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Elective } from "src/domain/elective/elective";
import { ElectiveModel, type ElectiveDocument } from "../schemas/elective.schema";
import { IElectiveRepository } from "src/domain/elective/elective.repository.interface";

/**
 * A Mongoose-backed implementation of IElectiveRepository.
 * Expects a Mongoose Model<Elective & Document> to be injected.
 */
@Injectable()
export class MongooseElectiveRepository implements IElectiveRepository {
  constructor(@InjectModel("Elective") private readonly model: Model<ElectiveDocument>) {}

  async find(): Promise<Elective[]> {
    const docs = await this.model.find().lean().exec();
    return docs.map((d) => this.toDomain(d));
  }

  async findById(id: string): Promise<Elective | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).lean().exec();
    return doc ? this.toDomain(doc) : null;
  }

  async create(data: Elective): Promise<Elective> {
    const created = await this.model.create(data as unknown as ElectiveModel);
    // fetch lean doc to normalize
    const doc = (await this.model.findById(created._id).lean().exec()) as ElectiveModel;
    return this.toDomain(doc);
  }

  async update(id: string, data: Elective): Promise<Elective | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updated = await this.model
      .findByIdAndUpdate(id, data as unknown as Partial<ElectiveModel>, {
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

  private toDomain(doc: ElectiveModel & { _id?: Types.ObjectId | string }): Elective {
    const { _id, ...rest } = doc ?? ({} as ElectiveModel);
    return {
      ...(rest as unknown as Omit<Elective, "id">),
      id: _id ? String(_id) : undefined,
    };
  }
}
