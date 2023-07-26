import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .setTitle('API')
    .setDescription('This is the api documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
