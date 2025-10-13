import { Module as NestModule } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { ApplicationModule } from "../application/application.module";

@NestModule({
  imports: [ApplicationModule],
  controllers: [AuthController],
})
export class InterfacesModule {}
