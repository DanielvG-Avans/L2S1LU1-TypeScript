import { REPOSITORIES } from "src/di-tokens";
import { Elective } from "src/domain/elective/elective";
import { IElectiveService } from "../ports/elective.port";
import { Injectable, Inject, Logger } from "@nestjs/common";
import { type IElectiveRepository } from "src/domain/elective/elective.repository.interface";
import { Result, ok, err } from "src/domain/result";

//* Elective Service Implementation
@Injectable()
export class ElectiveService implements IElectiveService {
  private readonly logger = new Logger(ElectiveService.name);

  constructor(
    @Inject(REPOSITORIES.ELECTIVE)
    private readonly electiveRepo: IElectiveRepository,
  ) {}

  public async getAllElectives(): Promise<Result<Elective[]>> {
    const electives = await this.electiveRepo.find();
    if (!electives || electives.length === 0) {
      this.logger.warn("No electives found");
      return err("NO_ELECTIVES_FOUND", "No electives found");
    }

    return ok(electives);
  }

  public async getElectiveById(id: string): Promise<Result<Elective>> {
    const elective = await this.electiveRepo.findById(id);
    if (!elective) {
      this.logger.warn(`Elective with id ${id} not found`);
      return err("ELECTIVE_NOT_FOUND", "Elective not found", { electiveId: id });
    }

    return ok(elective);
  }
}
