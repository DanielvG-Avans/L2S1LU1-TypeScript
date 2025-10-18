import { User } from "src/domain/user/user";
import { IUserService } from "../ports/user.port";
import { REPOSITORIES } from "../../di-tokens";
import { Injectable, Inject, Logger } from "@nestjs/common";
import { type IUserRepository } from "../../domain/user/user.repository.interface";
import { Result, ok, err } from "../../domain/result";

//* User Service Implementation
@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly userRepo: IUserRepository,
  ) {}

  public async getUserById(id: string): Promise<Result<User>> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      this.logger.warn(`User with id ${id} not found`);
      return err("USER_NOT_FOUND", "User not found", { userId: id });
    }
    return ok(user);
  }

  public async getUserByEmail(email: string): Promise<Result<User>> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      return err("USER_NOT_FOUND", "User not found", { email });
    }

    return ok(user);
  }
}
