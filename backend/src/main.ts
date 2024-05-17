import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Management Systems API for HR and Payroll')
    .setDescription(
      'API for managing employee data and payroll operations within organizational management systems. This API provides endpoints for handling personal details, employment records, and payroll processing, ensuring seamless integration and efficient management of human resources.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Endpoints for user authentication and authorization')
    // .addTag('Payroll', 'Endpoints for managing payroll data')
    .addTag('Employees', 'Endpoints for managing employee data')
    .addTag('Positions', 'Endpoints for managing employee positions')
    .addTag(
      'Employee details',
      'Endpoints for managing employee personal details',
    )
    .addTag('Family Types', 'Endpoints for managing family types')
    .addTag('Family Members', 'Endpoints for managing family members')
    .addTag('Income Types', 'Endpoints for managing income types')
    .addTag('Incomes', 'Endpoints for managing employee incomes')
    .addTag('Expense Types', 'Endpoints for managing expense types')
    .addTag('Expenses', 'Endpoints for managing employee expenses')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(`${process.env.PORT || 3000}`);
}
bootstrap();
