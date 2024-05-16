import { Module } from '@nestjs/common';
import { FamilyTypesService } from './family-types.service';
import { FamilyTypesController } from './family-types.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [FamilyTypesController],
  providers: [FamilyTypesService, PrismaService],
  imports: [CommonModule],
})
export class FamilyTypesModule {}
