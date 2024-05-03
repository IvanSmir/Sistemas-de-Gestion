import { Module } from '@nestjs/common';
import { CargosService } from './cargos.service';
import { CargosController } from './cargos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CargosController],
  providers: [CargosService, PrismaService],
})
export class CargosModule {}
