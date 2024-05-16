import { Module } from '@nestjs/common';
import { EmployeeDetailsService } from './employee-details.service';
import { EmployeeDetailsController } from './employee-details.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [EmployeeDetailsController],
  providers: [EmployeeDetailsService, PrismaService],
  imports: [CommonModule],
})
export class EmployeeDetailsModule {}
