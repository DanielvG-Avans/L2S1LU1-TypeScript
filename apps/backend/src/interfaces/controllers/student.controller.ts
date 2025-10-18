import { type RequestWithCookies, AuthGuard } from "../guards/auth.guard";
import { type IStudentService } from "src/application/ports/student.port";
import { type Elective } from "src/domain/elective/elective";
import { type favoriteDto } from "../dtos/favorites.dto";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
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

@ApiTags("students")
@Controller("students")
@UseGuards(AuthGuard, RolesGuard)
@Roles("student")
export class StudentController {
  private readonly logger = new Logger(StudentController.name);

  constructor(
    @Inject(SERVICES.STUDENT)
    private readonly studentService: IStudentService,
  ) {}

  @Get("me/favorites")
  @HttpCode(HttpStatus.OK)
  public async getFavorites(@Req() req: RequestWithCookies): Promise<Elective[]> {
    const studentId = req.authClaims?.sub;
    if (!studentId) {
      this.logger.warn("Unauthorized access attempt to get favorites");
      throw new UnauthorizedException("User not authenticated");
    }

    const result = await this.studentService.getFavorites(studentId.toString());
    if (!result.ok) {
      this.logger.warn(`Failed to get favorites: ${result.error.code}`);
      throw new NotFoundException(result.error.message || "No favorites found");
    }

    return result.data;
  }

  @Get("me/favorites/:electiveId")
  @HttpCode(HttpStatus.OK)
  public async checkIfFavorite(
    @Param("electiveId") electiveId: string,
    @Req() req: RequestWithCookies,
  ): Promise<{ isFavorite: boolean }> {
    const studentId = req.authClaims?.sub;
    if (!studentId) {
      this.logger.warn("Unauthorized access attempt to check favorite");
      throw new UnauthorizedException("User not authenticated");
    }

    const result = await this.studentService.isFavorite(studentId.toString(), electiveId);
    if (!result.ok) {
      this.logger.warn(`Failed to check favorite: ${result.error.code}`);
      throw new NotFoundException(result.error.message);
    }

    return { isFavorite: result.data };
  }

  @Post("me/favorites")
  @HttpCode(HttpStatus.CREATED)
  public async addFavorite(
    @Req() req: RequestWithCookies,
    @Body() dto: favoriteDto,
  ): Promise<void> {
    const studentId = req.authClaims?.sub;
    if (!studentId) {
      this.logger.warn("Unauthorized access attempt to add favorite");
      throw new UnauthorizedException("User not authenticated");
    }

    const result = await this.studentService.addFavorite(studentId.toString(), dto.electiveId);
    if (!result.ok) {
      this.logger.warn(`Failed to add favorite: ${result.error.code}`);
      throw new NotFoundException(result.error.message || "Failed to add favorite");
    }
  }

  @Delete("me/favorites")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeFavorite(
    @Req() req: RequestWithCookies,
    @Body() dto: favoriteDto,
  ): Promise<void> {
    const studentId = req.authClaims?.sub;
    if (!studentId) {
      this.logger.warn("Unauthorized access attempt to remove favorite");
      throw new UnauthorizedException("User not authenticated");
    }

    const result = await this.studentService.removeFavorite(studentId.toString(), dto.electiveId);
    if (!result.ok) {
      this.logger.warn(`Failed to remove favorite: ${result.error.code}`);
      throw new NotFoundException(result.error.message || "Failed to remove favorite");
    }
  }
}
