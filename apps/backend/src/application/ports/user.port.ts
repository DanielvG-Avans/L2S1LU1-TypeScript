import { User } from "src/domain/user/user";

//* User Service Interface
export interface IUserService {
  getUserById(id: string): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  getUserFavorites(userId: string): Promise<string[]>;
  addModuleToFavorites(userId: string, moduleId: string): Promise<string>;
  removeModuleFromFavorites(userId: string, moduleId: string): Promise<string>;
}
