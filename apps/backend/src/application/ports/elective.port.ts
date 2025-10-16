import { Elective } from "src/domain/elective/elective";

//* Elective Service Interface
export interface IElectiveService {
  getAllElectives(): Promise<Elective[]>;
  getElectiveById(id: string): Promise<Elective | undefined>;
}
