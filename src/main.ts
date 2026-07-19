/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  // eslint-disable-next-line prettier/prettier
  const frontendUrl = configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';

  // middleware
  app.useGlobalPipes(new ZodValidationPipe());

  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: [frontendUrl],
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  app.enableShutdownHooks();

  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start the application', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
