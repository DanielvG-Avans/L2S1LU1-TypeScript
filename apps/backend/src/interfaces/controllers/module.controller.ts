import { type IModuleService } from "src/application/ports/module.port";
import { AuthGuard } from "../guards/auth.guard";
import { ApiTags } from "@nestjs/swagger";
import { SERVICES } from "src/di-tokens";
import {
  HttpStatus,
  Controller,
  UseGuards,
  HttpCode,
  Inject,
  Logger,
  Param,
  // Post,
  Body,
  Get,
  NotFoundException,
} from "@nestjs/common";
import { Module } from "src/domain/module/module";

@ApiTags("modules")
@UseGuards(AuthGuard)
@Controller("modules")
export class ModuleController {
  private readonly logger: Logger = new Logger(ModuleController.name);

  constructor(
    @Inject(SERVICES.MODULE)
    private readonly moduleService: IModuleService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(): Promise<Module[]> {
    const result = await this.moduleService.getAllModules();
    if (!result || result.length === 0) {
      this.logger.warn("No modules found");
      throw new NotFoundException("No modules found");
    }

    return result;
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  public async getModuleById(@Param("id") id: string): Promise<Module> {
    const result = await this.moduleService.getModuleById(id);
    if (!result) {
      this.logger.warn(`Module not found: ${id}`);
      throw new NotFoundException("Module not found");
    }

    return result;
  }

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // public createModule(@Body() body: any): string {
  //   this.logger.log("POST /modules called");
  //   return this.moduleService.createModule(body);
  // }
}
