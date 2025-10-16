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
    if (!result || result.length === 0) {
      this.logger.warn("No electives found");
      throw new NotFoundException("No electives found");
    }

    return result;
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  public async getElectiveById(@Param("id") id: string): Promise<Elective> {
    const result = await this.electiveService.getElectiveById(id);
    if (!result) {
      this.logger.warn(`Elective not found: ${id}`);
      throw new NotFoundException("Elective not found");
    }

    return result;
  }

  @Get("favorites")
  @HttpCode(HttpStatus.OK)
  public async getFavoriteElectives(@Req() req: RequestWithCookies): Promise<Elective[]> {
    const userId = req.authClaims?.sub;
    if (!userId) {
      this.logger.warn("Unauthorized access attempt to get favorite electives");
      throw new UnauthorizedException("User not authenticated");
    }

    const favorites = await this.userService.getUserFavorites(userId.toString());
    if (!favorites || favorites.length === 0) {
      this.logger.warn(`No favorite electives found for user: ${userId}`);
      throw new NotFoundException("No favorite electives found");
    }

    return favorites;
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

    const favorite = await this.userService.isElectiveFavorite(userId.toString(), id);
    if (!favorite) {
      this.logger.warn(`Favorite elective not found: ${id}`);
      throw new NotFoundException("Favorite elective not found");
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
    if (!addResult) {
      this.logger.warn(
        `Failed to add elective ${favoriteDto.electiveId} to favorites for user: ${userId}`,
      );
      throw new NotFoundException("Failed to add favorite elective");
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
    if (!removeResult) {
      this.logger.warn(
        `Failed to remove elective ${favoriteDto.electiveId} from favorites for user: ${userId}`,
      );
      throw new NotFoundException("Failed to remove favorite elective");
    }

    return;
  }
}
