import { AuthGuard, type RequestWithCookies } from "../guards/auth.guard";
import type { IAuthService } from "src/application/ports/auth.port";
import type { loginDto } from "../dtos/login.dto";
import { User } from "src/domain/user/user";
import { ApiTags } from "@nestjs/swagger";
import { SERVICES } from "src/di-tokens";
import type { Response } from "express";
import { nodeEnv } from "src/constants";
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
  Req,
  Get,
  UseGuards,
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
  ): Promise<{ accessToken: string }> {
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
      return { accessToken: response.accessToken };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Login error: ${message}`);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get("me")
  @UseGuards(AuthGuard)
  public async me(@Req() req: RequestWithCookies): Promise<User> {
    const claims = req.authClaims;
    if (!claims || !claims.sub) {
      this.logger.warn("User not authenticated! No claims found in me()");
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    console.log("Auth claims in me():", claims);
    const userId = claims.sub.toString();
    const user = await this.authService.getUser(userId);
    if (!user) {
      this.logger.warn("User not found in me():" + userId);
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
