import { Module } from '@nestjs/common';
import { ExpenseTypesService } from './expense-types.service';
import { ExpenseTypesController } from './expense-types.controller';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ExpenseTypesController],
  providers: [ExpenseTypesService, PrismaService],
  imports: [CommonModule],
})
export class ExpenseTypesModule {}
