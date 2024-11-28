import type { ENV } from '@/lib/config/env';
import type { SigninDto } from '@/lib/dto/auth.dto';
import type { JwtSignPayload } from '@/lib/jwt/auth.middleware';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService<ENV, true>,
  ) {}

  async signin(body: SigninDto) {
    const user = await this.prisma.client.user.findUnique({
      where: { username: body.username },
      select: { password: true, id: true },
    });

    if (!user) {
      const hashed_pass = await hash(body.password, 11);
      const new_user = await this.prisma.client.user.create({
        data: { username: body.username, password: hashed_pass },
        select: { id: true },
      });

      const token = sign({ id: new_user.id }, this.configService.get<string>('JWT_SECRET'), {
        expiresIn: '1d',
      });

      return { message: 'Signed in successfully', token };
    }

    const valid_pass = await compare(body.password, user.password);

    if (!valid_pass) {
      throw new BadRequestException('wrong username or password');
    }
    const payload: JwtSignPayload = { id: user.id };
    const token = sign(payload, this.configService.get<string>('JWT_SECRET'), {
      expiresIn: '7d',
    });

    return { message: 'Signed in successfully', token };
  }
}
