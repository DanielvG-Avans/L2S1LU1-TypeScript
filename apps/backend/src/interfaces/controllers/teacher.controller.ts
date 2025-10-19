import { type RequestWithCookies, AuthGuard } from "../guards/auth.guard";
import { type ITeacherService } from "src/application/ports/teacher.port";
import { type Elective } from "src/domain/elective/elective";
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
  Inject,
  Logger,
  Get,
  Req,
} from "@nestjs/common";

@ApiTags("teachers")
@Controller("teachers")
@UseGuards(AuthGuard, RolesGuard)
@Roles("teacher")
export class TeacherController {
  private readonly logger = new Logger(TeacherController.name);

  constructor(
    @Inject(SERVICES.TEACHER)
    private readonly teacherService: ITeacherService,
  ) {}

  @Get("me/electives")
  @HttpCode(HttpStatus.OK)
  public async getElectivesGiven(@Req() req: RequestWithCookies): Promise<Elective[]> {
    const teacherId = req.authClaims?.sub;
    if (!teacherId) {
      this.logger.warn("Unauthorized access attempt to get electives");
      throw new UnauthorizedException("User not authenticated");
    }

    const result = await this.teacherService.getElectivesGiven(teacherId.toString());
    if (!result.ok) {
      this.logger.warn(`Failed to get modules: ${result.error.code}`);
      throw new NotFoundException(result.error.message || "No modules found");
    }

    return result.data;
  }
}
