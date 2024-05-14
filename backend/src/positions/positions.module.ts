import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService, PrismaService],
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), CommonModule],
})
export class PositionsModule {}
