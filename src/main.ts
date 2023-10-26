import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ResponseFormatterInterceptor } from './shared/response.formater';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      exposeDefaultValues: true,
    }),
    new ResponseFormatterInterceptor(),
  );
  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
