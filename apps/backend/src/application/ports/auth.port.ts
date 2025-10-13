export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: string;
  email: string;
  createdAt: Date;
};

export interface IAuthService {
  login(req: LoginRequest): Promise<LoginResponse>;
}
