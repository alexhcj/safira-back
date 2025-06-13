import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const node_env = configService.get<string>('node_env');
  const apiUrl = configService.get<string>('api.apiUrl');
  const globalPrefix = configService.get<string>('api.globalPrefix');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.setGlobalPrefix(globalPrefix);

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public',
  });

  app.enableCors({ origin: true });

  await app.listen(port || 9090, () =>
    console.log(
      `Server port: ${port}`,
      '\n',
      `Env mode: ${node_env && `${node_env}`}`,
      '\n',
      `App url: ${apiUrl}/${globalPrefix}`,
    ),
  );
}

bootstrap();
