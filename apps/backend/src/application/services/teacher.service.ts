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

  public async assignElectiveToTeacher(
    teacherId: string,
    electiveId: string,
  ): Promise<Result<boolean>> {
    // Verify teacher exists
    const user = await this.userRepo.findById(teacherId);
    if (!user || user.role !== "teacher") {
      this.logger.warn(`Teacher with id ${teacherId} not found`);
      return err("TEACHER_NOT_FOUND", "Teacher not found", { teacherId });
    }

    // Verify elective exists
    const electiveResult = await this.electiveService.getElectiveById(electiveId);
    if (!electiveResult.ok) {
      this.logger.warn(`Elective with id ${electiveId} not found`);
      return err("ELECTIVE_NOT_FOUND", "Elective not found", { electiveId });
    }

    // Check if already assigned
    const moduleList = user.modulesGiven || [];
    if (moduleList.includes(electiveId)) {
      this.logger.warn(`Elective ${electiveId} already assigned to teacher ${teacherId}`);
      return err("ALREADY_ASSIGNED", "Elective already assigned to this teacher");
    }

    // Add elective to teacher's modulesGiven
    const updatedUser = await this.userRepo.update(teacherId, {
      ...user,
      modulesGiven: [...moduleList, electiveId],
    });

    if (!updatedUser) {
      this.logger.error(`Failed to assign elective ${electiveId} to teacher ${teacherId}`);
      return err("ASSIGNMENT_FAILED", "Failed to assign elective to teacher");
    }

    this.logger.log(`Elective ${electiveId} assigned to teacher ${teacherId}`);
    return ok(true);
  }

  public async unassignElectiveFromTeacher(
    teacherId: string,
    electiveId: string,
  ): Promise<Result<boolean>> {
    // Verify teacher exists
    const user = await this.userRepo.findById(teacherId);
    if (!user || user.role !== "teacher") {
      this.logger.warn(`Teacher with id ${teacherId} not found`);
      return err("TEACHER_NOT_FOUND", "Teacher not found", { teacherId });
    }

    // Check if assigned
    const moduleList = user.modulesGiven || [];
    if (!moduleList.includes(electiveId)) {
      this.logger.warn(`Elective ${electiveId} not assigned to teacher ${teacherId}`);
      return err("NOT_ASSIGNED", "Elective not assigned to this teacher");
    }

    // Remove elective from teacher's modulesGiven
    const updatedUser = await this.userRepo.update(teacherId, {
      ...user,
      modulesGiven: moduleList.filter((id) => id !== electiveId),
    });

    if (!updatedUser) {
      this.logger.error(`Failed to unassign elective ${electiveId} from teacher ${teacherId}`);
      return err("UNASSIGNMENT_FAILED", "Failed to unassign elective from teacher");
    }

    this.logger.log(`Elective ${electiveId} unassigned from teacher ${teacherId}`);
    return ok(true);
  }
}
