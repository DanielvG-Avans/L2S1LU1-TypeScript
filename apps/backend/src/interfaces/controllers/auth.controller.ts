import { nodeEnv } from "src/constants";
import type { Response } from "express";
import { SERVICES } from "src/di-tokens";
import { ApiTags } from "@nestjs/swagger";
import { User } from "src/domain/user/user";
import type { loginDto } from "../dtos/login.dto";
import type { IAuthService } from "src/application/ports/auth.port";
import {
  HttpException,
  HttpStatus,
  Controller,
  HttpCode,
  Logger,
  Inject,
  Body,
  Post,
  Res,
} from "@nestjs/common";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  private readonly logger: Logger;

  constructor(
    @Inject(SERVICES.AUTH)
    private readonly authService: IAuthService,
  ) {
    this.logger = new Logger("AuthController");
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  public async login(
    @Body() dto: loginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    if (!dto || !dto.email || !dto.password) {
      this.logger.warn("Login attempt with missing email or password");
      throw new HttpException("Email and password are required", HttpStatus.UNAUTHORIZED);
    }

    try {
      const response = await this.authService.login(dto);
      if (!response) {
        this.logger.warn("Login attempt with invalid email or password");
        throw new HttpException("Invalid email or password", HttpStatus.UNAUTHORIZED);
      }

      res.cookie("ACCESSTOKEN", response.accessToken, {
        httpOnly: nodeEnv === "production",
        secure: nodeEnv === "production",
        sameSite: "lax",
        maxAge: 3600000, // 1 hour
      });
      return response.user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Login error: ${message}`);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }
}
