import { SERVICES } from "../di-tokens";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "../constants";
import { AuthService } from "./services/auth.service";
import { Module as NestModule } from "@nestjs/common";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@NestModule({
  imports: [
    InfrastructureModule,
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [{ provide: SERVICES.AUTH, useClass: AuthService }],
  exports: [SERVICES.AUTH],
})
export class ApplicationModule {}
