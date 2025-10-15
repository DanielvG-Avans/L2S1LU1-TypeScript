import { Module } from "src/domain/module/module";

//* Module Service Interface
export interface IModuleService {
  getAllModules(): Promise<Module[]>;
  getModuleById(id: string): Promise<Module | undefined>;
}
