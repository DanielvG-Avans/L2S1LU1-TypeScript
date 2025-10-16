import { IUserRepository } from "../../../domain/user/user.repository.interface";
import { UserModel, type UserDocument } from "../schemas/user.schema";
import { User } from "../../../domain/user/user";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";

@Injectable()
export class MongooseUserRepository implements IUserRepository {
  constructor(@InjectModel("User") private readonly model: Model<UserDocument>) {}

  public async find(): Promise<User[]> {
    const docs = (await this.model.find().lean().exec()) as Array<
      UserModel & { _id?: Types.ObjectId | string }
    >;
    return docs.map((d) => this.toDomain(d));
  }

  public async findById(id: string): Promise<User | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;
    const doc = (await this.model.findById(id).lean().exec()) as
      | (UserModel & { _id?: Types.ObjectId | string })
      | null;
    return doc ? this.toDomain(doc) : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    const doc = (await this.model.findOne({ email }).lean().exec()) as
      | (UserModel & { _id?: Types.ObjectId | string })
      | null;
    return doc ? this.toDomain(doc) : null;
  }

  public async create(data: User): Promise<User> {
    const created = await this.model.create(data as unknown as UserModel);
    const doc = (await this.model.findById(created._id).lean().exec()) as
      | (UserModel & { _id?: Types.ObjectId | string })
      | null;
    if (!doc) throw new Error("Failed to read created user");
    return this.toDomain(doc);
  }

  public async update(id: string, data: User): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updated = (await this.model
      .findByIdAndUpdate(id, data as unknown as Partial<UserModel>, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec()) as (UserModel & { _id?: Types.ObjectId | string }) | null;
    return updated ? this.toDomain(updated) : null;
  }

  public async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const removed = await this.model.findByIdAndDelete(id).exec();
    return removed != null;
  }

  private toDomain(doc: UserModel & { _id?: Types.ObjectId | string }): User {
    const { _id, ...rest } = doc ?? ({} as UserModel);
    return {
      ...(rest as unknown as Omit<User, "id">),
      id: _id ? String(_id) : undefined,
    };
  }
}
