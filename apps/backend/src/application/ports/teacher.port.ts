import { Elective } from "../../domain/elective/elective";
import { Result } from "../../domain/result";

//* Teacher Service Interface
export interface ITeacherService {
  getElectivesGiven(teacherId: string): Promise<Result<Elective[]>>;
  assignElectiveToTeacher(teacherId: string, electiveId: string): Promise<Result<boolean>>;
  unassignElectiveFromTeacher(teacherId: string, electiveId: string): Promise<Result<boolean>>;
}
