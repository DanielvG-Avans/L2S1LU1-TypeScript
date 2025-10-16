import { AuthGuard, type RequestWithCookies } from "../guards/auth.guard";
import { type IAuthService } from "src/application/ports/auth.port";
import { type IUserService } from "src/application/ports/user.port";
import { type loginDto } from "../dtos/login.dto";
import { User } from "src/domain/user/user";
import { ApiTags } from "@nestjs/swagger";
import { SERVICES } from "src/di-tokens";
import { type Response } from "express";
import { nodeEnv } from "src/constants";
import {
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
  UnauthorizedException,
} from "@nestjs/common";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  private readonly logger: Logger;

  constructor(
    @Inject(SERVICES.AUTH)
    private readonly authService: IAuthService,
    @Inject(SERVICES.USER)
    private readonly userService: IUserService,
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
      throw new UnauthorizedException("Email and password are required");
    }

    try {
      const response = await this.authService.login(dto);
      if (!response) {
        this.logger.warn("Login attempt with invalid email or password");
        throw new UnauthorizedException("Invalid email or password");
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
      throw new UnauthorizedException(message);
    }
  }

  @Get("me")
  @UseGuards(AuthGuard)
  public async me(@Req() req: RequestWithCookies): Promise<User> {
    const claims = req.authClaims;
    if (!claims || !claims.sub) {
      this.logger.warn("User not authenticated! No claims found in me()");
      throw new UnauthorizedException("Unauthorized");
    }

    const userId = claims.sub.toString();
    const user = await this.userService.getUserById(userId);
    if (!user) {
      this.logger.warn("User not found in me():" + userId);
      throw new UnauthorizedException("Unauthorized");
    }

    return user;
  }
}
