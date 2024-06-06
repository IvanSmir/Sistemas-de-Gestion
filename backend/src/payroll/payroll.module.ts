import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PayrollController],
  providers: [PayrollService, PrismaService],
  imports: [CommonModule],
})
export class PayrollModule {}
