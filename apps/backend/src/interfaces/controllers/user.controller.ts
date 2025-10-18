import { type RequestWithCookies, AuthGuard } from "../guards/auth.guard";
import { type IUserService } from "src/application/ports/user.port";
import { ApiTags } from "@nestjs/swagger";
import { SERVICES } from "src/di-tokens";
import {
  UnauthorizedException,
  Controller,
  UseGuards,
  Inject,
  Logger,
  Get,
  Req,
} from "@nestjs/common";
import { UserWithoutPassword } from "../dtos/user.dto";

@ApiTags("users")
@UseGuards(AuthGuard)
@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    @Inject(SERVICES.USER)
    private readonly userService: IUserService,
  ) {}

  @Get("me")
  public async me(@Req() req: RequestWithCookies): Promise<UserWithoutPassword> {
    const claims = req.authClaims;
    if (!claims || !claims.sub) {
      this.logger.warn("User not authenticated! No claims found in me()");
      throw new UnauthorizedException("Unauthorized");
    }

    const userId = claims.sub.toString();
    const userResult = await this.userService.getUserById(userId);
    if (!userResult.ok) {
      this.logger.warn(`User not found in me(): ${userId}`);
      throw new UnauthorizedException("Unauthorized");
    }

    const user = userResult.data as UserWithoutPassword;
    return user;
  }
}
