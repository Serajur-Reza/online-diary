import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Online diary')
    .setDescription('Online diary API description')
    .setVersion('Online diary')
    .addTag('diary')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:5000',
      // 'https://yourapp.com',
      // 'https://staging.yourapp.com',
    ], // Allows all domains
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allows all common methods
    allowedHeaders: 'Content-Type, Accept, Authorization', // Allows common headers
    credentials: true, // Allows cookies, authorization headers, etc.
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
