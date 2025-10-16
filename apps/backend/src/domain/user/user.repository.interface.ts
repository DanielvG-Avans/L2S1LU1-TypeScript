import { User } from "./user";

export interface IUserRepository {
  find(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: User): Promise<User>;
  update(id: string, data: User): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
