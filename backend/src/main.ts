import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar prefijo global
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 API de Riesgos ejecutándose en http://localhost:${port}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   - GET    /api/amenazas`);
  console.log(`   - POST   /api/amenazas`);
  console.log(`   - GET    /api/vulnerabilidades`);
  console.log(`   - POST   /api/vulnerabilidades`);
  console.log(`   - POST   /api/riesgos`);
  console.log(`   - GET    /api/riesgos`);
}

bootstrap();
