import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { jwtSecret } from "../../constants";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

type RequestWithCookies = Request & { cookies?: { ACCESSTOKEN?: string } };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: { [key: string]: any } = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });

      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(request: RequestWithCookies): string | undefined {
    const cookies = request.cookies;
    if (!cookies) return undefined;
    const token = cookies.ACCESSTOKEN;
    return typeof token === "string" ? token : undefined;
  }
}
