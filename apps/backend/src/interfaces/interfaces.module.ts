import { Module as NestModule } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { ModuleController } from "./controllers/module.controller";
import { ApplicationModule } from "../application/application.module";

@NestModule({
  imports: [ApplicationModule],
  controllers: [AuthController, ModuleController],
})
export class InterfacesModule {}
