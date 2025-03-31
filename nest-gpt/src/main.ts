import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

import * as bodyParser from 'body-parser';

const port = process.env.PORT;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            })
        );
        
        // Configurations cross domain
    app.enableCors();
    
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
        
    await app.listen(port);
    Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');

}
bootstrap();
