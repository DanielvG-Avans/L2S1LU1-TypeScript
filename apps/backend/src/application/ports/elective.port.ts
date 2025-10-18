import { Elective } from "src/domain/elective/elective";
import { Result } from "src/domain/result";

//* Elective Service Interface
export interface IElectiveService {
  getAllElectives(): Promise<Result<Elective[]>>;
  getElectiveById(id: string): Promise<Result<Elective>>;
  createElective(data: Elective): Promise<Result<Elective>>;
  updateElective(id: string, data: Elective): Promise<Result<Elective>>;
  deleteElective(id: string): Promise<Result<boolean>>;
}
