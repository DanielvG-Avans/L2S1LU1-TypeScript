import { SERVICES } from "../di-tokens";
import { AuthService } from "./services/auth.service";
import { Module as NestModule } from "@nestjs/common";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@NestModule({
  imports: [InfrastructureModule],
  providers: [{ provide: SERVICES.AUTH, useClass: AuthService }],
  exports: [SERVICES.AUTH],
})
export class ApplicationModule {}
