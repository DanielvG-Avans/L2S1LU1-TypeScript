import { Injectable, Inject, Logger } from "@nestjs/common";
import { IStudentService } from "../ports/student.port";
import { REPOSITORIES, SERVICES } from "../../di-tokens";
import { type IUserRepository } from "../../domain/user/user.repository.interface";
import { type IElectiveService } from "../ports/elective.port";
import { Elective } from "../../domain/elective/elective";
import { Result, ok, err } from "../../domain/result";

//* Student Service Implementation
@Injectable()
export class StudentService implements IStudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly userRepo: IUserRepository,
    @Inject(SERVICES.ELECTIVE)
    private readonly electiveService: IElectiveService,
  ) {}

  // Normalizes a single value to a string (handles ObjectId-like objects and other types)
  private normalizeIdValue(val: unknown): string {
    if (typeof val === "string") return val;

    if (val && typeof (val as { toHexString?: unknown }).toHexString === "function") {
      return (val as { toHexString: () => string }).toHexString();
    }

    if (val && typeof (val as { toString?: unknown }).toString === "function") {
      const s = (val as { toString: () => string }).toString();
      const m = s.match(/([0-9a-fA-F]{24})/);
      return m ? m[1] : s;
    }

    return String(val);
  }

  // Normalizes an array of unknown values into an array of strings
  private normalizeIdArray(vals: unknown[]): string[] {
    return vals.map((v) => this.normalizeIdValue(v));
  }

  public async getFavorites(studentId: string): Promise<Result<Elective[]>> {
    const student = await this.userRepo.findStudentById(studentId);
    if (!student) {
      this.logger.warn(`Student with id ${studentId} not found`);
      return err("STUDENT_NOT_FOUND", "Student not found", { studentId });
    }

    const favoriteList = student.favorites || [];
    const favorites: Elective[] = [];

    for (const electiveId of favoriteList) {
      const electiveResult = await this.electiveService.getElectiveById(electiveId);
      if (electiveResult.ok) {
        favorites.push(electiveResult.data);
      }
    }

    return ok(favorites);
  }

  public async addFavorite(studentId: string, electiveId: string): Promise<Result<boolean>> {
    const student = await this.userRepo.findStudentById(studentId);
    if (!student) {
      this.logger.warn(`Student with id ${studentId} not found`);
      return err("STUDENT_NOT_FOUND", "Student not found", { studentId });
    }

    // Normalize stored favorites to strings to handle ObjectId and other types
    const favoriteList = student.favorites ?? [];
    const favs = Array.isArray(favoriteList) ? (favoriteList as unknown[]) : [];
    const favStrings = this.normalizeIdArray(favs);

    if (favStrings.includes(electiveId)) {
      this.logger.warn(`Elective ${electiveId} is already a favorite of student ${studentId}`);
      return err("ELECTIVE_ALREADY_FAVORITE", "Elective is already a favorite", {
        studentId,
        electiveId,
      });
    }

    student.favorites.push(electiveId);
    await this.userRepo.update(studentId, student);

    return ok(true);
  }

  public async removeFavorite(studentId: string, electiveId: string): Promise<Result<boolean>> {
    const student = await this.userRepo.findStudentById(studentId);
    if (!student) {
      this.logger.warn(`Student with id ${studentId} not found`);
      return err("STUDENT_NOT_FOUND", "Student not found", { studentId });
    }

    // Normalize stored favorites to strings to handle ObjectId and other types
    const favoriteList = student.favorites ?? [];
    const favs = Array.isArray(favoriteList) ? (favoriteList as unknown[]) : [];
    const favStrings = this.normalizeIdArray(favs);

    if (!favStrings.includes(electiveId)) {
      this.logger.warn(`Elective ${electiveId} is not a favorite of student ${studentId}`);
      return err("ELECTIVE_NOT_FAVORITE", "Elective is not a favorite", { studentId, electiveId });
    }

    // Remove all entries that normalize to the given electiveId and persist as strings
    const newFavStrings = favStrings.filter((s) => s !== electiveId);
    student.favorites = newFavStrings;
    await this.userRepo.update(studentId, student);

    return ok(true);
  }

  public async isFavorite(studentId: string, electiveId: string): Promise<Result<boolean>> {
    const student = await this.userRepo.findStudentById(studentId);
    if (!student) {
      this.logger.warn(`Student with id ${studentId} not found`);
      return err("STUDENT_NOT_FOUND", "Student not found", { studentId });
    }

    const favoriteList = student.favorites ?? [];
    const favStrings = Array.isArray(favoriteList)
      ? this.normalizeIdArray(favoriteList as unknown[])
      : [];

    return ok(favStrings.includes(electiveId));
  }
}
