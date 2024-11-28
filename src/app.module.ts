import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { EnvModule } from './lib/config/env.module';
import { PrismaModule } from './lib/prisma/prisma.module';

@Module({
  imports: [EnvModule, ChatModule, AuthModule, PrismaModule],
})
export class AppModule {}
