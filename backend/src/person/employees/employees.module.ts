import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersonModule } from 'src/person/person.module';
import { FamilyMembersModule } from '../family-members/family-members.module';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, PrismaService],
  imports: [CommonModule, PersonModule, FamilyMembersModule],
})
export class EmployeesModule {}
