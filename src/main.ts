import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.use(json({ limit: '200mb' }));

    const config = new DocumentBuilder()
        .setTitle('Base API doc')
        .setDescription('The base API')
        .setVersion('1.0')
        .addTag('configurator')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(process.env.APP_PORT);
}
bootstrap();
