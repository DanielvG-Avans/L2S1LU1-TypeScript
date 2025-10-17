import { User } from "src/domain/user/user";
import { IUserService } from "../ports/user.port";
import { REPOSITORIES, SERVICES } from "../../di-tokens";
import { Elective } from "../../domain/elective/elective";
import { Injectable, Inject, Logger } from "@nestjs/common";
import { type IElectiveService } from "../ports/elective.port";
import { type IUserRepository } from "../../domain/user/user.repository.interface";
import { Result, ok, err } from "../../domain/result";

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

  public async getUserFavorites(userId: string): Promise<Result<Elective[]>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      return err("USER_NOT_FOUND", "User not found", { userId });
    }

    const favoriteList = user.favorites || [];
    const favorites: Elective[] = [];

    for (const electiveId of favoriteList) {
      const electiveResult = await this.electiveService.getElectiveById(electiveId);
      if (electiveResult.ok) {
        favorites.push(electiveResult.data);
      }
    }

    return ok(favorites);
  }

  public async addElectiveToFavorites(
    userId: string,
    electiveId: string,
  ): Promise<Result<boolean>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      return err("USER_NOT_FOUND", "User not found", { userId });
    }

    if (user.favorites?.includes(electiveId)) {
      this.logger.warn(`Elective with id ${electiveId} is already a favorite of user ${userId}`);
      return err("ELECTIVE_ALREADY_FAVORITE", "Elective is already a favorite", {
        userId,
        electiveId,
      });
    }

    user.favorites = user.favorites || [];
    user.favorites.push(electiveId);
    await this.userRepo.update(userId, user);

    return ok(true);
  }

  public async removeElectiveFromFavorites(
    userId: string,
    electiveId: string,
  ): Promise<Result<boolean>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      return err("USER_NOT_FOUND", "User not found", { userId });
    }
    user.favorites = user.favorites || [];
    user.favorites = user.favorites.filter((id) => id !== electiveId);
    await this.userRepo.update(userId, user);

    return ok(true);
  }

  public async isElectiveFavorite(userId: string, electiveId: string): Promise<Result<boolean>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      this.logger.warn(`User with id ${userId} not found`);
      return err("USER_NOT_FOUND", "User not found", { userId });
    }

    const favoriteList = user.favorites ?? [];
    if (Array.isArray(favoriteList)) {
      const favs = favoriteList as unknown[];
      for (let i = 0; i < favs.length; i++) {
        const val: unknown = favs[i];
        if (typeof val === "string") continue;

        if (val && typeof (val as { toHexString?: unknown }).toHexString === "function") {
          // mongodb ObjectId
          favs[i] = (val as { toHexString: () => string }).toHexString();
          continue;
        }

        if (val && typeof (val as { toString?: unknown }).toString === "function") {
          const s = (val as { toString: () => string }).toString();
          const m = s.match(/([0-9a-fA-F]{24})/);
          favs[i] = m ? m[1] : s;
          continue;
        }

        favs[i] = String(val);
      }
    }

    if (!favoriteList || !favoriteList.includes(electiveId)) {
      return ok(false);
    }

    return ok(true);
  }
}
