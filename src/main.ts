import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public',
  });

  app.enableCors();

  await app.listen(process.env.PORT || 5000, () =>
    console.log(`Server port: ${process.env.PORT}`),
  );
}

bootstrap();
