import * as dotenv from "dotenv";
import { SERVICES } from "../di-tokens";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./services/auth.service";
import { Module as NestModule } from "@nestjs/common";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

@NestModule({
  imports: [
    InfrastructureModule,
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: "24h" },
    }),
  ],
  providers: [{ provide: SERVICES.AUTH, useClass: AuthService }],
  exports: [SERVICES.AUTH],
})
export class ApplicationModule {}
