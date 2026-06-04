import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {INestApplication} from "@nestjs/common";


export  function  setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('TODO Backend')
        .setDescription('CRUD API Documentation')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
}