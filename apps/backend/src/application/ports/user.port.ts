import { User } from "../../domain/user/user";
import { Elective } from "../../domain/elective/elective";

//* User Service Interface
export interface IUserService {
  getUserById(id: string): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  getUserFavorites(userId: string): Promise<Elective[]>;
  addElectiveToFavorites(userId: string, electiveId: string): Promise<boolean>;
  removeElectiveFromFavorites(userId: string, electiveId: string): Promise<boolean>;
}
