import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('RWA Tokenization Platform API')
    .setDescription('Real World Asset tokenization platform - RESTful API for property tokenization, KYC, and blockchain integration')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication and registration')
    .addTag('Properties', 'Property management and tokenization')
    .addTag('Documents', 'PDF document processing and extraction')
    .addTag('KYC', 'Know Your Customer verification')
    .addTag('Users', 'User profile and holdings management')
    .addTag('Blockchain', 'Blockchain integration and smart contract interactions')
    .addTag('AI', 'AI-powered portfolio analysis and recommendations')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🚀 RWA Backend running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger API Docs: http://localhost:${port}/api/docs`);
}
bootstrap();
