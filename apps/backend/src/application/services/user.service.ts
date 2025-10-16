import { User } from "src/domain/user/user";
import { IUserService } from "../ports/user.port";
import { REPOSITORIES, SERVICES } from "../../di-tokens";
import { Elective } from "../../domain/elective/elective";
import { Injectable, Inject, Logger } from "@nestjs/common";
import { type IElectiveService } from "../ports/elective.port";
import { type IUserRepository } from "../../domain/user/user.repository.interface";

//* User Service Implementation
@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly userRepo: IUserRepository,
    @Inject(SERVICES.ELECTIVE)
    private readonly electiveService: IElectiveService,
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
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      throw new Error("User not found");
    }

    return user;
  }

  public async getUserFavorites(userId: string): Promise<Elective[]> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      throw new Error("User not found");
    }

    const favoriteList = user.favorites || [];
    const favorites: Elective[] = [];

    for (const electiveId of favoriteList) {
      const elective = await this.electiveService.getElectiveById(electiveId);
      if (elective) {
        favorites.push(elective);
      }
    }

    return favorites;
  }

  public async addElectiveToFavorites(userId: string, electiveId: string): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      throw new Error("User not found");
    }

    user.favorites = user.favorites || [];
    user.favorites.push(electiveId);
    await this.userRepo.update(userId, user);

    return true;
  }

  public async removeElectiveFromFavorites(userId: string, electiveId: string): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      throw new Error("User not found");
    }
    user.favorites = user.favorites || [];
    user.favorites = user.favorites.filter((id) => id !== electiveId);
    await this.userRepo.update(userId, user);

    return true;
  }

  public async isElectiveFavorite(userId: string, electiveId: string): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      throw new Error("User not found");
    }

    const favoriteList = user.favorites || [];
    if (!favoriteList.includes(electiveId)) {
      this.logger.warn(`Elective with id ${electiveId} is not a favorite of user ${userId}`);
      throw new Error("Elective not found");
    }

    return true;
  }
}
