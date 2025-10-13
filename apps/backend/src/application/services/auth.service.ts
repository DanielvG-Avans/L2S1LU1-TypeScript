import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { REPOSITORIES } from "../../di-tokens";
import { Inject, Injectable } from "@nestjs/common";
import { loginResponse, loginRequest, IAuthService } from "../ports/auth.port";
import type { IUserRepository } from "../../domain/user/user.repository.interface";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(REPOSITORIES.USER)
    private readonly userRepo: IUserRepository,
    private jwtService: JwtService,
  ) {}

  public async login(data: loginRequest): Promise<loginResponse> {
    if (!data || !data.email || !data.password) {
      throw new Error("Email and password are required");
    }

    const user = await this.userRepo
      .find()
      .then((users) => users.find((u) => u.email === data.email));
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    return { accessToken, user };
  }
}
