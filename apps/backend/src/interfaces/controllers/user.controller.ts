import { type RequestWithCookies, AuthGuard } from "../guards/auth.guard";
import { type IUserService } from "src/application/ports/user.port";
import { UserDTO } from "../dtos/user.dto";
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
  public async me(@Req() req: RequestWithCookies): Promise<UserDTO> {
    const userId = req.authClaims?.sub;
    if (!userId) {
      this.logger.warn("User not authenticated! No claims found in me()");
      throw new UnauthorizedException("User not authenticated");
    }

    const userResult = await this.userService.getUserById(userId.toString());
    if (!userResult.ok) {
      this.logger.warn(`User not found in me(): ${userId}`);
      throw new UnauthorizedException("Unauthorized");
    }

    return userResult.data;
  }
}
