import { Module as NestModule } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { ApplicationModule } from "../application/application.module";
import { ElectiveController } from "./controllers/elective.controller";

@NestModule({
  imports: [ApplicationModule],
  controllers: [AuthController, ElectiveController],
})
export class InterfacesModule {}
