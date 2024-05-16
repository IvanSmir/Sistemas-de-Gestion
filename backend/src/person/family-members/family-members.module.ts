import { Module } from '@nestjs/common';
import { FamilyMembersService } from './family-members.service';
import { FamilyMembersController } from './family-members.controller';
import { PersonModule } from 'src/person/person.module';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FamilyMembersController],
  providers: [FamilyMembersService, PrismaService],
  imports: [PersonModule, CommonModule],
})
export class FamilyMembersModule {}
