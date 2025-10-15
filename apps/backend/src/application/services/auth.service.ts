import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { SERVICES } from "../../di-tokens";
import { type IUserService } from "../ports/user.port";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { loginResponse, loginRequest, IAuthService } from "../ports/auth.port";

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(SERVICES.USER)
    private readonly userService: IUserService,
    private jwtService: JwtService,
  ) {}

  public async login(data: loginRequest): Promise<loginResponse> {
    if (!data || !data.email || !data.password) {
      throw new Error("Email and password are required");
    }

    const user = await this.userService.getUserByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      first: user.firstName,
      last: user.lastName,
    });
    return { accessToken };
  }
}
