import { REPOSITORIES } from "src/di-tokens";
import { Elective } from "src/domain/elective/elective";
import { IElectiveService } from "../ports/elective.port";
import { Injectable, Inject, Logger } from "@nestjs/common";
import { type IElectiveRepository } from "src/domain/elective/elective.repository.interface";

//* Elective Service Implementation
@Injectable()
export class ElectiveService implements IElectiveService {
  private readonly logger = new Logger(ElectiveService.name);

  constructor(
    @Inject(REPOSITORIES.ELECTIVE)
    private readonly electiveRepo: IElectiveRepository,
  ) {}

  public async getAllElectives(): Promise<Elective[]> {
    const modules = await this.electiveRepo.find();
    if (!modules || modules.length === 0) {
      this.logger.warn("No modules found");
      throw new Error(`No modules found`);
    }

    return modules;
  }

  public async getElectiveById(id: string): Promise<Elective | undefined> {
    const module = await this.electiveRepo.findById(id);
    if (!module) {
      this.logger.warn(`Module with id ${id} not found`);
      throw new Error(`Module with id ${id} not found`);
    }

    return module;
  }
}
