import { Module } from '@nestjs/common';
import { BasicConfigService } from './basicConfig.service';
import { BasicConfigController } from './basicConfig.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [BasicConfigController],
  providers: [BasicConfigService, PrismaService],
  imports: [CommonModule],
})
export class BasicConfigModule {}
