import { User } from "../../domain/user/user";
import { Elective } from "../../domain/elective/elective";
import { Result } from "../../domain/result";

//* User Service Interface
export interface IUserService {
  getUserById(id: string): Promise<Result<User>>;
  getUserByEmail(email: string): Promise<Result<User>>;

  getUserFavorites(userId: string): Promise<Result<Elective[]>>;
  addElectiveToFavorites(userId: string, electiveId: string): Promise<Result<boolean>>;
  removeElectiveFromFavorites(userId: string, electiveId: string): Promise<Result<boolean>>;

  isElectiveFavorite(userId: string, electiveId: string): Promise<Result<boolean>>;
}
