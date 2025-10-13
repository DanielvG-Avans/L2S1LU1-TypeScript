import { Module } from "@nestjs/common";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { AuthService } from "./application/services/auth.service";
import { AuthController } from "./interfaces/controllers/auth.controller";

@Module({
  imports: [InfrastructureModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AppModule {}
