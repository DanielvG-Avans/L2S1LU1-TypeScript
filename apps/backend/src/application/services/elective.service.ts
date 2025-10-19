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

  public async createElective(data: Elective): Promise<Result<Elective>> {
    if (!data) {
      this.logger.warn("No elective data provided for creation");
      return err("NO_ELECTIVE_DATA", "No elective data provided");
    }

    const created = await this.electiveRepo.create(data);
    if (!created) {
      this.logger.error("Failed to create elective");
      return err("ELECTIVE_CREATE_FAILED", "Failed to create elective");
    }

    return ok(created);
  }

  public async updateElective(
    id: string,
    data: Elective | Partial<Elective>,
  ): Promise<Result<Elective>> {
    const elective = await this.electiveRepo.findById(id);
    if (!elective) {
      this.logger.warn(`Elective with id ${id} not found`);
      return err("ELECTIVE_NOT_FOUND", "Elective not found", { electiveId: id });
    }

    const updated = await this.electiveRepo.update(id, data);
    if (!updated) {
      this.logger.error(`Failed to update elective with id ${id}`);
      return err("ELECTIVE_UPDATE_FAILED", "Failed to update elective", { electiveId: id });
    }

    return ok(updated);
  }

  public async deleteElective(id: string): Promise<Result<boolean>> {
    const elective = await this.electiveRepo.findById(id);
    if (!elective) {
      this.logger.warn(`Elective with id ${id} not found`);
      return err("ELECTIVE_NOT_FOUND", "Elective not found", { electiveId: id });
    }

    const deletedInUse = await this.electiveRepo.isElectiveInUse(id);
    if (deletedInUse) {
      this.logger.warn(`Cannot delete elective with id ${id} because it is in use`);
      return err("ELECTIVE_IN_USE", "Cannot delete elective because it is in use", {
        electiveId: id,
      });
    }

    const deleted = await this.electiveRepo.delete(id);
    if (!deleted) {
      this.logger.error(`Failed to delete elective with id ${id}`);
      return err("ELECTIVE_DELETE_FAILED", "Failed to delete elective", { electiveId: id });
    }
    this.logger.log(`Elective with id ${id} deleted`);
    return ok(true);
  }
}
