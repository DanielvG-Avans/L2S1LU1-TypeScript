import { REPOSITORIES } from "src/di-tokens";
import { Module } from "src/domain/module/module";
import { IModuleService } from "../ports/module.port";
import { Injectable, Inject, Logger } from "@nestjs/common";
import { type IModuleRepository } from "src/domain/module/module.repository.interface";

//* Module Service Implementation
@Injectable()
export class ModuleService implements IModuleService {
  private readonly logger = new Logger(ModuleService.name);

  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly moduleRepo: IModuleRepository,
  ) {}

  public async getAllModules(): Promise<Module[]> {
    const modules = await this.moduleRepo.find();
    if (!modules || modules.length === 0) {
      this.logger.warn("No modules found");
      return [];
    }

    return modules;
  }

  public async getModuleById(id: string): Promise<Module | undefined> {
    const module = await this.moduleRepo.findById(id);
    if (!module) {
      this.logger.warn(`Module with id ${id} not found`);
      throw new Error(`Module with id ${id} not found`);
    }

    return module;
  }
}
