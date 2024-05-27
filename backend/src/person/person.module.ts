import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersonController } from './person.controller';

@Module({
  providers: [PersonService, PrismaService],
  exports: [PersonService],
  imports: [CommonModule],
  controllers: [PersonController],
})
export class PersonModule {}
