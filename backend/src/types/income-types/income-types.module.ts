import { Module } from '@nestjs/common';
import { IncomeTypesService } from './income-types.service';
import { IncomeTypesController } from './income-types.controller';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [IncomeTypesController],
  providers: [IncomeTypesService, PrismaService],
  imports: [CommonModule],
})
export class IncomeTypesModule {}
