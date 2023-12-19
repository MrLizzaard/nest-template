import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import validationOptions from './utils/validation-options';

async function bootstrap() {
  // Nest 애플리케이션 인스턴스를 생성합니다.
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  // ConfigService를 사용하여 구성 정보를 얻습니다.
  const configService = app.get(ConfigService<AllConfigType>);

  // 우아한 종료를 위한 훅을 활성화합니다.
  app.enableShutdownHooks();

  // 전역 API 접두사를 설정하고 특정 경로에서는 제외합니다.
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  // URI 버전을 사용하여 API 버전 관리를 활성화합니다.
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 전역 유효성 검사 파이프를 적용합니다.
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  // 전역 클래스 직렬화 인터셉터를 적용합니다.
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger 문서를 생성하기 위한 옵션을 설정합니다.
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Swagger 문서를 생성하고 'docs' 엔드포인트에 Swagger UI를 설정합니다.
  // http://localhost:3030/swagger 스웨거 주소

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  // 구성에서 포트를 가져와서 애플리케이션을 해당 포트에서 실행합니다.
  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

// 애플리케이션을 부트스트랩합니다.
bootstrap();
