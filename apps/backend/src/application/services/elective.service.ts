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
    const electives = await this.electiveRepo.find();
    if (!electives || electives.length === 0) {
      this.logger.warn("No electives found");
      throw new Error(`No electives found`);
    }

    return electives;
  }

  public async getElectiveById(id: string): Promise<Elective | undefined> {
    const elective = await this.electiveRepo.findById(id);
    if (!elective) {
      this.logger.warn(`Elective with id ${id} not found`);
      throw new Error(`Elective with id ${id} not found`);
    }

    return elective;
  }
}
