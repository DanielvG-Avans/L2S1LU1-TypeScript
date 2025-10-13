//* Login
export type loginRequest = {
  email: string;
  password: string;
};

export type loginResponse = {
  user: {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    favorites: string[]; // list of Module _id's
    createdAt?: string;
    updatedAt?: string;
  };
  accessToken: string;
};

//* Auth Service Interface
export interface IAuthService {
  login(req: loginRequest): Promise<loginResponse>;
}
