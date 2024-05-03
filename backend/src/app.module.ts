import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CargosModule } from './cargos/cargos.module';
import { PrismaService } from './prisma/prisma.service';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [CargosModule, EmployeesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
