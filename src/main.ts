import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import { Server } from 'http';
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
  app.setGlobalPrefix('api');
  await app.listen(process.env.SERVER_INT_PORT ?? 4224).then((server: Server) => {
    console.info();
    console.info('Blast-off 🚀 >> Server.address :', server.address()?.valueOf());
    console.info();
  });
}

bootstrap();
