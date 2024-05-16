import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PositionsModule } from './person/employees/positions/positions.module';
import { CommonModule } from './common/common.module';
import { PersonModule } from './person/person.module';
import { EmployeesModule } from './person/employees/employees.module';
import { EmployeeDetailsModule } from './person/employees/employee-details/employee-details.module';
import { FamilyTypesModule } from './types/family-types/family-types.module';
import { FamilyMembersModule } from './person/family-members/family-members.module';
import { IncomeTypesModule } from './types/income-types/income-types.module';
import { IncomesModule } from './transactions/incomes/incomes.module';
import { ExpenseTypesModule } from './types/expense-types/expense-types.module';
import { ExpensesModule } from './transactions/expenses/expenses.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PositionsModule, CommonModule, PersonModule, EmployeesModule, EmployeeDetailsModule, FamilyTypesModule, FamilyMembersModule, IncomeTypesModule, IncomesModule, ExpenseTypesModule, ExpensesModule],
  exports: [ConfigModule],
})
export class AppModule {}
