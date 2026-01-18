import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

const server = express();

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors(); // Essential for your Next.js frontend to talk to this
  await app.init();
  return server;
};

// Vercel expects an exported function or a server instance
export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};
