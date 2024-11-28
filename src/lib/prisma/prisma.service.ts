import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit {
  private logger = new Logger(PrismaService.name);
  public client = new PrismaClient({ log: process.env.NODE_ENV === 'dev' ? ['query'] : [] });

  async onModuleInit() {
    const start = process.hrtime();
    await this.client.$connect();
    const diff = process.hrtime(start);
    const ms = (diff[0] * 1_000 + diff[1] / 1_000_000).toFixed(0);
    this.logger.verbose(`Database connected via Prisma +${ms}ms`);
  }
}
