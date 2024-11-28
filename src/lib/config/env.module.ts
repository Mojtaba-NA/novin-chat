import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './env';

@Module({
  imports: [ConfigModule.forRoot({ cache: true, isGlobal: true, validate: validateEnv })],
})
export class EnvModule {}
