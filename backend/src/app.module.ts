import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PositionsModule } from './positions/positions.module';
import { CommonModule } from './common/common.module';
import { PersonModule } from './person/person.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PositionsModule, CommonModule, PersonModule, EmployeesModule],
  exports: [ConfigModule],
})
export class AppModule {}
