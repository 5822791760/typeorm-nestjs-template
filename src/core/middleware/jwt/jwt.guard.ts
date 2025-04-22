import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { AppConfig } from '@core/config';
import { decodeUserJwt } from '@core/shared/common/common.crypto';
import { newInfo } from '@core/shared/common/common.neverthrow';
import { ApiException } from '@core/shared/http/http.exception';

import { AUTH_HEADER, IS_PUBLIC_KEY, USER_CONTEXT } from './jwt.common';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const jwtConfig = this.configService.getOrThrow<AppConfig['jwt']>('jwt');

    const token = this._extractTokenFromHeader(request);
    if (!token) {
      throw new ApiException(newInfo('invalidToken'), 400);
    }

    const rClaims = decodeUserJwt(token, jwtConfig.salt);
    if (rClaims.isErr()) {
      throw new ApiException(rClaims.error, 400);
    }

    request[USER_CONTEXT] = rClaims.value;

    return true;
  }

  private _extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers[AUTH_HEADER];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1]; // Extract token after "Bearer "
  }
}
