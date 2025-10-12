import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY } from "../infrastructure/infrastructure.tokens";
import type { IUserRepository } from "../domain/user/user.repository.interface";

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: IUserRepository,
  ) {}

  // Example: lookup a user by email, to be used in login flow
  async getUserByEmail(email: string) {
    const all = await this.users.find();
    return all.find((u) => u.email === email) ?? null;
  }
}
