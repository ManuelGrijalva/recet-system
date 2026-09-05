import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DrizzleExceptionFilter } from './common/filters/drizzle-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // 1. Prefijo global para la API REST
  app.setGlobalPrefix('api');

  // 2. Cookie Parser para manejo de sesion JWT en cookies HTTP-only
  app.use(cookieParser());

  // 3. CORS configurado para comunicacion con el frontend en Next.js
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // 4. Tuberia global de validacion estricta
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 5. Filtro global de excepciones de PostgreSQL / Drizzle
  app.useGlobalFilters(new DrizzleExceptionFilter());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.info(`Servidor API iniciado exitosamente en el puerto ${port}`);
}

void bootstrap();
