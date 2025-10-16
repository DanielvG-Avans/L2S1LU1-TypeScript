import { Elective } from "src/domain/elective/elective";
import { Result } from "src/domain/result";

//* Elective Service Interface
export interface IElectiveService {
  getAllElectives(): Promise<Result<Elective[]>>;
  getElectiveById(id: string): Promise<Result<Elective>>;
}
