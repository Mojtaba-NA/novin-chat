import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const adapter = new FastifyAdapter();
  adapter.enableCors({});
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    logger: ['error', 'log', 'verbose'],
  });
  await app.register(helmet);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
