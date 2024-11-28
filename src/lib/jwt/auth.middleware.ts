import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { verify } from 'jsonwebtoken';
import type { ENV } from '../config/env';

export interface JwtSignPayload {
  id: string;
}

export interface JWTPayload extends JwtSignPayload {
  iat: number;
  exp: number;
}

type AuthRequest = FastifyRequest['raw'] & {
  user?: JWTPayload;
};

const unauthorized = { message: 'Unauthorized', statusCode: 401 };

const unauth_response = (res: FastifyReply['raw'], message: Record<string, string | number>) => {
  res.writeHead(401, {
    'Content-Type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'authorization',
    'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  res.end(JSON.stringify(message));
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService<ENV, true>) {}

  async use(req: AuthRequest, res: FastifyReply['raw'], next: () => void) {
    const auth = req.headers.authorization;
    if (!auth) {
      unauth_response(res, unauthorized);
      return;
    }

    const token = auth.split(' ')[1];
    if (!token) {
      unauth_response(res, unauthorized);
      return;
    }
    try {
      const payload = <JWTPayload>verify(token, this.configService.get('JWT_SECRET'));

      if (new Date().getTime() > payload.exp * 1000) {
        unauth_response(res, { statusCode: 401, message: 'Expired Token' });
        return;
      }

      req.user = payload;
    } catch {
      unauth_response(res, unauthorized);
      return;
    }

    next();
  }
}
