import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import { AppModule } from './app.module';

/**
 * Bootstrap Application
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    cors({
      credentials: true,
      origin: '*',
    }),
  );
  await app.listen(process.env.SERVER_PORT ?? 4224);
}

bootstrap();
