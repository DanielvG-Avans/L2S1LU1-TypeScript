import { type IElectiveService } from "src/application/ports/elective.port";
import { type IUserService } from "src/application/ports/user.port";
import { Elective } from "src/domain/elective/elective";
import { AuthGuard } from "../guards/auth.guard";
import { ApiTags } from "@nestjs/swagger";
import { SERVICES } from "src/di-tokens";
import {
  NotFoundException,
  HttpStatus,
  Controller,
  UseGuards,
  HttpCode,
  Inject,
  Logger,
  Param,
  Body,
  Get,
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
}
