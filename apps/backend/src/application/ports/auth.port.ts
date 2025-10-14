import { User } from "src/domain/user/user";

//* Login
export type loginRequest = {
  email: string;
  password: string;
};

export type loginResponse = {
  accessToken: string;
};

//* Auth Service Interface
export interface IAuthService {
  login(req: loginRequest): Promise<loginResponse>;
  getUser(id: string): Promise<User | null>;
}
