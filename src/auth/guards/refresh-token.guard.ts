import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const refreshToken = this.extractRefreshToken(request);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  private extractRefreshToken(request: AuthenticatedRequest): string | null {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = request.cookies?.refreshToken;

    return typeof refreshToken === 'string' ? refreshToken : null;
  }
}
