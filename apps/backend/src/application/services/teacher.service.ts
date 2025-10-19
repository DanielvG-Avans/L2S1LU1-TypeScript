import { Injectable, Inject, Logger } from "@nestjs/common";
import { ITeacherService } from "../ports/teacher.port";
import { REPOSITORIES, SERVICES } from "../../di-tokens";
import { type IUserRepository } from "../../domain/user/user.repository.interface";
import { type IElectiveService } from "../ports/elective.port";
import { Elective } from "../../domain/elective/elective";
import { Result, ok, err } from "../../domain/result";

//* Teacher Service Implementation
@Injectable()
export class TeacherService implements ITeacherService {
  private readonly logger = new Logger(TeacherService.name);

  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly userRepo: IUserRepository,
    @Inject(SERVICES.ELECTIVE)
    private readonly electiveService: IElectiveService,
  ) {}

  public async getElectivesGiven(teacherId: string): Promise<Result<Elective[]>> {
    const user = await this.userRepo.findById(teacherId);
    if (!user || user.role !== "teacher") {
      this.logger.warn(`Teacher with id ${teacherId} not found`);
      return err("TEACHER_NOT_FOUND", "Teacher not found", { teacherId });
    }

    // TypeScript narrows user to TeacherUser after the role check
    const moduleList = user.modulesGiven || [];
    const modules: Elective[] = [];

    for (const electiveId of moduleList) {
      const electiveResult = await this.electiveService.getElectiveById(electiveId);
      if (electiveResult.ok) {
        modules.push(electiveResult.data);
      }
    }

    return ok(modules);
  }
}
