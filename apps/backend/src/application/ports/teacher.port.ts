import { Elective } from "../../domain/elective/elective";
import { Result } from "../../domain/result";

//* Teacher Service Interface
export interface ITeacherService {
  getModulesGiven(teacherId: string): Promise<Result<Elective[]>>;
  // Add more teacher-specific methods as needed
}
