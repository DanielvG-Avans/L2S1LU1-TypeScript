import bcrypt from "bcrypt";
import { REPOSITORIES } from "../../di-tokens";
import { Inject, Injectable } from "@nestjs/common";
import { IAuthService, LoginResponse } from "../ports/auth.port";
import type { IUserRepository } from "../../domain/user/user.repository.interface";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly userRepo: IUserRepository,
  ) {}

  public async login(data: { email: string; password: string }): Promise<LoginResponse> {
    const user = {
      id: 1,
      email: data.email,
      passwordHash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    }; // Mocked user

    const match = await bcrypt.compare(data.password, user.passwordHash);
    if (!match) {
      return {
        id: "00000-00000-00000-00000-00000-00000",
        email: "notfound@example.com",
        createdAt: new Date(0),
      }; // Indicate failed login
    }

    return { id: user.id.toLocaleString(), email: user.email, createdAt: new Date() };
  }

  public logout() {
    return { success: true, message: "Logout successful" };
  }
}
