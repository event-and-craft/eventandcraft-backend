import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface AdminJwtPayload {
  sub?: string;
  email?: string;
  mobile?: string;
  isAdmin?: boolean;
  userType?: number;
  authType?: string;
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const payload: AdminJwtPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
        },
      );

      // Perform admin validations:
      // 1. userType === 0 (Admin)
      // 2. isAdmin === true
      // 3. authType === 'emailandpassword'
      if (
        !payload.isAdmin ||
        payload.userType !== 0 ||
        payload.authType !== 'emailandpassword'
      ) {
        throw new ForbiddenException(
          'Access denied. Administrator privileges required.',
        );
      }

      request['user'] = payload;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException(
        'Invalid or expired authentication token',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
