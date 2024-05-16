import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [IncomesController],
  providers: [IncomesService, PrismaService],
  imports: [CommonModule],
})
export class IncomesModule {}
