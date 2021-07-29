import { NestFactory } from '@nestjs/core';
import { init } from './web3';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  init();
}
bootstrap();
