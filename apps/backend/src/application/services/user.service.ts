import { REPOSITORIES } from "src/di-tokens";
import { IUserService } from "../ports/user.port";
import { Injectable, Inject, Logger } from "@nestjs/common";
import { type IUserRepository } from "src/domain/user/user.repository.interface";
import { User } from "src/domain/user/user";

//* User Service Implementation
@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly userRepo: IUserRepository,
  ) {}

  public async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      this.logger.warn(`User with id ${id} not found`);
      throw new Error("User not found");
    }
    return user;
  }

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepo.find();
    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      throw new Error("User not found");
    }

    const userByEmail = user.find((u) => u.email === email);
    if (!userByEmail) {
      this.logger.warn(`User with email ${email} not found`);
      throw new Error("User not found");
    }

    return userByEmail;
  }

  public async getUserFavorites(userId: string): Promise<string[]> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      throw new Error("User not found");
    }

    const favoriteList = user.favorites || [];
    return favoriteList;
  }

  public async addModuleToFavorites(userId: string, moduleId: string): Promise<string> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      throw new Error("User not found");
    }

    user.favorites = user.favorites || [];
    user.favorites.push(moduleId);
    await this.userRepo.update(userId, user);

    return moduleId;
  }

  public async removeModuleFromFavorites(userId: string, moduleId: string): Promise<string> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      throw new Error("User not found");
    }
    user.favorites = user.favorites || [];
    user.favorites = user.favorites.filter((id) => id !== moduleId);
    await this.userRepo.update(userId, user);

    return moduleId;
  }
}
