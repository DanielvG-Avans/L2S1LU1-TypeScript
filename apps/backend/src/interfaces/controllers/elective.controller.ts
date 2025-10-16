import { type RequestWithCookies, AuthGuard } from "../guards/auth.guard";
import { type IElectiveService } from "src/application/ports/elective.port";
import { type IUserService } from "src/application/ports/user.port";
import { type favoriteDto } from "../dtos/favorites.dto";
import { Elective } from "src/domain/elective/elective";
import { ApiTags } from "@nestjs/swagger";
import { SERVICES } from "src/di-tokens";
import {
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
  Controller,
  UseGuards,
  HttpCode,
  Inject,
  Logger,
  Delete,
  Param,
  Body,
  Post,
  Get,
  Req,
} from "@nestjs/common";

@ApiTags("electives")
@UseGuards(AuthGuard)
@Controller("electives")
export class ElectiveController {
  private readonly logger: Logger = new Logger(ElectiveController.name);

  constructor(
    @Inject(SERVICES.ELECTIVE)
    private readonly electiveService: IElectiveService,
    @Inject(SERVICES.USER)
    private readonly userService: IUserService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(): Promise<Elective[]> {
    const result = await this.electiveService.getAllElectives();
    if (!result.ok) {
      this.logger.warn(`Failed to get electives: ${result.error.code}`);
      throw new NotFoundException(result.error.message || "No electives found");
    }

    return result.data;
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  public async getElectiveById(@Param("id") id: string): Promise<Elective> {
    const result = await this.electiveService.getElectiveById(id);
    if (!result.ok) {
      this.logger.warn(`Elective not found: ${id}`);
      throw new NotFoundException(result.error.message || "Elective not found");
    }

    return result.data;
  }

  @Get("favorites")
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

  @Get("favorites/:electiveId")
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

  @Post("favorites")
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

  @Delete("favorites")
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
