import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFamilyTypeDto } from './dto/create-family-type.dto';
import { UpdateFamilyTypeDto } from './dto/update-family-type.dto';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class FamilyTypesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  private selecOptions = {
    id: true,
    name: true,
  };
  async create(createFamilyTypeDto: CreateFamilyTypeDto, user: Users) {
    try {
      return await this.prismaService.familyTypes.create({
        data: {
          ...createFamilyTypeDto,
          userId: user.id,
        },
        select: this.selecOptions,
      });
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Family Type',
        createFamilyTypeDto.name,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    try {
      const skip = (page - 1) * limit;
      const totalCount = await this.prismaService.familyTypes.count();
      const familyTypes = await this.prismaService.familyTypes.findMany({
        select: this.selecOptions,
        skip,
        take: limit,
      });
      return {
        data: familyTypes,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Family Type', '');
    }
  }

  update(id: string, updateFamilyTypeDto: UpdateFamilyTypeDto, user: Users) {
    try {
      if (isUUID(id)) {
        return this.prismaService.familyTypes.update({
          where: { id },
          data: {
            ...updateFamilyTypeDto,
            userId: user.id,
          },
          select: this.selecOptions,
        });
      } else {
        throw new BadRequestException('Invalid Family Type ID');
      }
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Family Type', id);
    }
  }

  remove(id: string, user: Users) {
    try {
      if (isUUID(id)) {
        return this.prismaService.familyTypes.update({
          where: { id },
          data: {
            isDeleted: true,
            userId: user.id,
          },
          select: this.selecOptions,
        });
      } else {
        throw new BadRequestException('Invalid Family Type ID');
      }
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Family Type', id);
    }
  }
}
