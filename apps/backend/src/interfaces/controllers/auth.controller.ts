import { SERVICES } from "src/di-tokens";
import { ApiTags } from "@nestjs/swagger";
import type { loginDto } from "../dtos/login.dto";
import type { IAuthService, loginResponse } from "src/application/ports/auth.port";
import {
  HttpException,
  HttpStatus,
  Controller,
  HttpCode,
  Inject,
  Body,
  Post,
} from "@nestjs/common";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject(SERVICES.AUTH)
    private readonly authService: IAuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  public async login(@Body() dto: loginDto): Promise<loginResponse> {
    if (!dto || !dto.email || !dto.password) {
      throw new HttpException("Email and password are required", HttpStatus.UNAUTHORIZED);
    }

    try {
      const response = await this.authService.login(dto);
      if (!response) {
        throw new HttpException("Invalid email or password", HttpStatus.UNAUTHORIZED);
      }
      return response;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.UNAUTHORIZED);
    }
  }
}
