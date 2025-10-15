import { SERVICES } from "../di-tokens";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "../constants";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { Module as NestModule } from "@nestjs/common";
import { ModuleService } from "./services/module.service";
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
  providers: [
    { provide: SERVICES.AUTH, useClass: AuthService },
    { provide: SERVICES.USER, useClass: UserService },
    { provide: SERVICES.MODULE, useClass: ModuleService },
  ],
  exports: [SERVICES.AUTH, SERVICES.MODULE, SERVICES.USER],
})
export class ApplicationModule {}
