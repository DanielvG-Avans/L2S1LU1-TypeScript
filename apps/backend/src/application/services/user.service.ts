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

  // Normalizes a single value to a string (handles ObjectId-like objects and other types)
  private normalizeIdValue(val: unknown): string {
    if (typeof val === "string") return val;

    if (val && typeof (val as { toHexString?: unknown }).toHexString === "function") {
      return (val as { toHexString: () => string }).toHexString();
    }

    if (val && typeof (val as { toString?: unknown }).toString === "function") {
      const s = (val as { toString: () => string }).toString();
      const m = s.match(/([0-9a-fA-F]{24})/);
      return m ? m[1] : s;
    }

    return String(val);
  }

  // Normalizes an array of unknown values into an array of strings
  private normalizeIdArray(vals: unknown[]): string[] {
    return vals.map((v) => this.normalizeIdValue(v));
  }

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

    // Normalize stored favorites to strings to handle ObjectId and other types
    const favoriteList = user.favorites ?? [];
    const favs = Array.isArray(favoriteList) ? (favoriteList as unknown[]) : [];
    const favStrings = this.normalizeIdArray(favs);

    if (favStrings.includes(electiveId)) {
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

    // Normalize stored favorites to strings to handle ObjectId and other types
    const favoriteList = user.favorites ?? [];
    const favs = Array.isArray(favoriteList) ? (favoriteList as unknown[]) : [];
    const favStrings = this.normalizeIdArray(favs);

    if (!favStrings.includes(electiveId)) {
      this.logger.warn(`Elective with id ${electiveId} is not a favorite of user ${userId}`);
      return err("ELECTIVE_NOT_FAVORITE", "Elective is not a favorite", { userId, electiveId });
    }

    // Remove all entries that normalize to the given electiveId and persist as strings
    const newFavStrings = favStrings.filter((s) => s !== electiveId);
    user.favorites = newFavStrings;
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
    const favStrings = Array.isArray(favoriteList)
      ? this.normalizeIdArray(favoriteList as unknown[])
      : [];

    if (!favStrings.includes(electiveId)) {
      return ok(false);
    }

    return ok(true);
  }
}
