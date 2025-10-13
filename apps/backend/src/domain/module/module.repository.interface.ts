import { Module } from "./module";

export interface IModuleRepository {
  find(): Promise<Module[]>;
  findById(id: string): Promise<Module | null>;
  create(data: Module): Promise<Module>;
  update(id: string, data: Module): Promise<Module | null>;
  delete(id: string): Promise<boolean>;
}
