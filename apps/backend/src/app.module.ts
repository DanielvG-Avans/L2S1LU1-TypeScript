import { Module } from "@nestjs/common";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { AuthService } from "./application/auth.service";

@Module({
  imports: [InfrastructureModule],
  providers: [AuthService],
})
export class AppModule {}
