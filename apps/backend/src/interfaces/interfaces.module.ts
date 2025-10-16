import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { ApplicationModule } from "../application/application.module";
import { ElectiveController } from "./controllers/elective.controller";

@Module({
  imports: [ApplicationModule],
  controllers: [AuthController, ElectiveController],
})
export class InterfacesModule {}
