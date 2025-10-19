import { type RequestWithCookies, AuthGuard } from "../guards/auth.guard";
import { type IUserService } from "src/application/ports/user.port";
import { type IStudentService } from "src/application/ports/student.port";
import { type ITeacherService } from "src/application/ports/teacher.port";
import { type Elective } from "src/domain/elective/elective";
import { UserDTO } from "../dtos/user.dto";
import { ApiTags } from "@nestjs/swagger";
import { SERVICES } from "src/di-tokens";
import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  Controller,
  UseGuards,
  HttpStatus,
  HttpCode,
  Inject,
  Logger,
  Delete,
  Param,
  Post,
  Get,
  Req,
} from "@nestjs/common";

@ApiTags("users")
@UseGuards(AuthGuard)
@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    @Inject(SERVICES.USER)
    private readonly userService: IUserService,
    @Inject(SERVICES.STUDENT)
    private readonly studentService: IStudentService,
    @Inject(SERVICES.TEACHER)
    private readonly teacherService: ITeacherService,
  ) {}

  /**
   * Helper to extract authenticated user claims
   * AuthGuard ensures authClaims exists, but TypeScript doesn't know that
   */
  private getAuthClaims(req: RequestWithCookies) {
    if (!req.authClaims) {
      throw new UnauthorizedException("Authentication required");
    }
    return req.authClaims;
  }

  /**
   * Get the authenticated user's profile
   * Available to all authenticated users
   */
  @Get("me")
  @HttpCode(HttpStatus.OK)
  public async getProfile(@Req() req: RequestWithCookies): Promise<UserDTO> {
    const { sub: userId } = this.getAuthClaims(req);

    const userResult = await this.userService.getUserById(userId.toString());
    if (!userResult.ok) {
      this.logger.warn(`User not found: ${userId}`);
      throw new UnauthorizedException("User not found");
    }

    return userResult.data;
  }

  /**
   * Get student's favorite electives
   * Only available to users with role: student
   */
  @Get("me/favorites")
  @HttpCode(HttpStatus.OK)
  public async getFavorites(@Req() req: RequestWithCookies): Promise<Elective[]> {
    const { sub: userId, role } = this.getAuthClaims(req);

    if (role !== "student") {
      this.logger.warn(`Non-student user ${userId} attempted to access favorites`);
      throw new ForbiddenException("Only students can access favorites");
    }

    const result = await this.studentService.getFavorites(userId.toString());
    if (!result.ok) {
      this.logger.warn(`Failed to get favorites: ${result.error.code}`);
      throw new NotFoundException(result.error.message || "Failed to get favorites");
    }

    return result.data;
  }

  /**
   * Check if an elective is in student's favorites
   * Only available to users with role: student
   */
  @Get("me/favorites/:electiveId")
  @HttpCode(HttpStatus.OK)
  public async checkIfFavorite(
    @Param("electiveId") electiveId: string,
    @Req() req: RequestWithCookies,
  ): Promise<{ isFavorite: boolean }> {
    const { sub: userId, role } = this.getAuthClaims(req);

    if (role !== "student") {
      this.logger.warn(`Non-student user ${userId} attempted to check favorite`);
      throw new ForbiddenException("Only students can check favorites");
    }

    if (!electiveId) {
      throw new BadRequestException("Elective ID is required");
    }

    const result = await this.studentService.isFavorite(userId.toString(), electiveId);
    if (!result.ok) {
      this.logger.warn(`Failed to check favorite: ${result.error.code}`);
      throw new NotFoundException(result.error.message);
    }

    return { isFavorite: result.data };
  }

  /**
   * Add an elective to student's favorites
   * Only available to users with role: student
   */
  @Post("me/favorites/:electiveId")
  @HttpCode(HttpStatus.CREATED)
  public async addFavorite(
    @Param("electiveId") electiveId: string,
    @Req() req: RequestWithCookies,
  ): Promise<void> {
    const { sub: userId, role } = this.getAuthClaims(req);

    if (role !== "student") {
      this.logger.warn(`Non-student user ${userId} attempted to add favorite`);
      throw new ForbiddenException("Only students can add favorites");
    }

    if (!electiveId) {
      throw new BadRequestException("Elective ID is required");
    }

    const result = await this.studentService.addFavorite(userId.toString(), electiveId);
    if (!result.ok) {
      this.logger.warn(`Failed to add favorite: ${result.error.code}`);
      if (result.error.code === "ELECTIVE_ALREADY_FAVORITE") {
        throw new BadRequestException(result.error.message || "Elective is already a favorite");
      }
      throw new NotFoundException(result.error.message || "Failed to add favorite");
    }
  }

  /**
   * Remove an elective from student's favorites
   * Only available to users with role: student
   */
  @Delete("me/favorites/:electiveId")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeFavorite(
    @Param("electiveId") electiveId: string,
    @Req() req: RequestWithCookies,
  ): Promise<void> {
    const { sub: userId, role } = this.getAuthClaims(req);

    if (role !== "student") {
      this.logger.warn(`Non-student user ${userId} attempted to remove favorite`);
      throw new ForbiddenException("Only students can remove favorites");
    }

    if (!electiveId) {
      throw new BadRequestException("Elective ID is required");
    }

    const result = await this.studentService.removeFavorite(userId.toString(), electiveId);
    if (!result.ok) {
      this.logger.warn(`Failed to remove favorite: ${result.error.code}`);
      throw new NotFoundException(result.error.message || "Failed to remove favorite");
    }
  }

  /**
   * Get electives taught by the teacher
   * Only available to users with role: teacher
   */
  @Get("me/electives")
  @HttpCode(HttpStatus.OK)
  public async getElectives(@Req() req: RequestWithCookies): Promise<Elective[]> {
    const { sub: userId, role } = this.getAuthClaims(req);

    if (role !== "teacher") {
      this.logger.warn(`Non-teacher user ${userId} attempted to access electives`);
      throw new ForbiddenException("Only teachers can access their electives");
    }

    const result = await this.teacherService.getElectivesGiven(userId.toString());
    if (!result.ok) {
      this.logger.warn(`Failed to get electives: ${result.error.code}`);
      throw new NotFoundException(result.error.message || "Failed to get electives");
    }

    return result.data;
  }
}
