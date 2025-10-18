import { User } from "../../domain/user/user";
import { Result } from "../../domain/result";

//* User Service Interface
export interface IUserService {
  getUserById(id: string): Promise<Result<User>>;
  getUserByEmail(email: string): Promise<Result<User>>;
}
