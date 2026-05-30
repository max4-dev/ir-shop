import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigSchema, NodeEnv } from './common/config/app-config';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<ConfigSchema, true>);
  const nodeEnv = configService.get('NODE_ENV', { infer: true });
  const isProd = nodeEnv === NodeEnv.PRODUCTION;
  const apiPrefix = configService.get('API_PREFIX', { infer: true });
  const port = configService.get('APP_PORT', { infer: true });
  const clientUrl = configService.get('CLIENT_URL', { infer: true });
  const adminUrl = configService.get('ADMIN_URL', { infer: true });

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.use(helmet({ contentSecurityPolicy: isProd }));
  app.use(cookieParser());

  app.enableCors({
    origin: [clientUrl, adminUrl],
    credentials: true,
  });

  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  app.enableShutdownHooks();

  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('Shop API')
      .setDescription('API интернет-магазина')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const docsPath = apiPrefix ? `${apiPrefix}/docs` : 'docs';

    SwaggerModule.setup(docsPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        withCredentials: true,
      },
    });
  }

  await app.listen(port);
  Logger.log(`API listening on :${port} (${nodeEnv})`, 'Bootstrap');
}

void bootstrap();
