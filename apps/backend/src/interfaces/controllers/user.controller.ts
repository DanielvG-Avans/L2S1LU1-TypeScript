import { type RequestWithCookies, AuthGuard } from "../guards/auth.guard";
import { type IUserService } from "src/application/ports/user.port";
import { type Elective } from "src/domain/elective/elective";
import { type favoriteDto } from "../dtos/favorites.dto";
import { ApiTags } from "@nestjs/swagger";
import { SERVICES } from "src/di-tokens";
import {
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
  Controller,
  UseGuards,
  HttpCode,
  Delete,
  Inject,
  Logger,
  Param,
  Body,
  Post,
  Get,
  Req,
} from "@nestjs/common";
import { UserWithoutPassword } from "../dtos/user.dto";

@ApiTags("users")
@UseGuards(AuthGuard)
@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    @Inject(SERVICES.USER)
    private readonly userService: IUserService,
  ) {}

  @Get("me")
  @UseGuards(AuthGuard)
  public async me(@Req() req: RequestWithCookies): Promise<UserWithoutPassword> {
    const claims = req.authClaims;
    if (!claims || !claims.sub) {
      this.logger.warn("User not authenticated! No claims found in me()");
      throw new UnauthorizedException("Unauthorized");
    }

    const userId = claims.sub.toString();
    const userResult = await this.userService.getUserById(userId);
    if (!userResult.ok) {
      this.logger.warn(`User not found in me(): ${userId}`);
      throw new UnauthorizedException("Unauthorized");
    }

    const user = userResult.data as UserWithoutPassword;
    return user;
  }

  @Get("me/favorites")
  @HttpCode(HttpStatus.OK)
  public async getFavoriteElectives(@Req() req: RequestWithCookies): Promise<Elective[]> {
    const userId = req.authClaims?.sub;
    if (!userId) {
      this.logger.warn("Unauthorized access attempt to get favorite electives");
      throw new UnauthorizedException("User not authenticated");
    }

    const favoritesResult = await this.userService.getUserFavorites(userId.toString());
    if (!favoritesResult.ok) {
      this.logger.warn(`Failed to get favorites for user ${userId}: ${favoritesResult.error.code}`);
      throw new NotFoundException(favoritesResult.error.message || "No favorite electives found");
    }

    return favoritesResult.data;
  }

  @Get("me/favorites/:electiveId")
  @HttpCode(HttpStatus.OK)
  public async checkIfElectiveIsFavorite(
    @Param("electiveId") id: string,
    @Req() req: RequestWithCookies,
  ): Promise<void> {
    const userId = req.authClaims?.sub;
    if (!userId) {
      this.logger.warn("Unauthorized access attempt to get favorite electives");
      throw new UnauthorizedException("User not authenticated");
    }

    const favoriteResult = await this.userService.isElectiveFavorite(userId.toString(), id);
    if (!favoriteResult.ok) {
      this.logger.warn(`Elective ${id} is not a favorite: ${favoriteResult.error.code}`);
      throw new NotFoundException(favoriteResult.error.message || "Favorite elective not found");
    }

    return;
  }

  @Post("me/favorites")
  @HttpCode(HttpStatus.CREATED)
  public async addFavoriteElective(
    @Req() req: RequestWithCookies,
    @Body() favoriteDto: favoriteDto,
  ): Promise<void> {
    const userId = req.authClaims?.sub;
    if (!userId) {
      this.logger.warn("Unauthorized access attempt to get favorite electives");
      throw new UnauthorizedException("User not authenticated");
    }

    const addResult = await this.userService.addElectiveToFavorites(
      userId.toString(),
      favoriteDto.electiveId,
    );
    if (!addResult.ok) {
      this.logger.warn(
        `Failed to add elective ${favoriteDto.electiveId} to favorites for user ${userId}: ${addResult.error.code}`,
      );
      throw new NotFoundException(addResult.error.message || "Failed to add favorite elective");
    }

    return;
  }

  @Delete("me/favorites")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeFavoriteElective(
    @Req() req: RequestWithCookies,
    @Body() favoriteDto: favoriteDto,
  ): Promise<void> {
    const userId = req.authClaims?.sub;
    if (!userId) {
      this.logger.warn("Unauthorized access attempt to get favorite electives");
      throw new UnauthorizedException("User not authenticated");
    }

    const removeResult = await this.userService.removeElectiveFromFavorites(
      userId.toString(),
      favoriteDto.electiveId,
    );
    if (!removeResult.ok) {
      this.logger.warn(
        `Failed to remove elective ${favoriteDto.electiveId} from favorites for user ${userId}: ${removeResult.error.code}`,
      );
      throw new NotFoundException(
        removeResult.error.message || "Failed to remove favorite elective",
      );
    }

    return;
  }
}
