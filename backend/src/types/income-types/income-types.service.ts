import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIncomeTypeDto } from './dto/create-income-type.dto';
import { UpdateIncomeTypeDto } from './dto/update-income-type.dto';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class IncomeTypesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  private selectOptions = {
    id: true,
    name: true,
    deductible: true,
  };

  async create(createIncomeTypeDto: CreateIncomeTypeDto, user: Users) {
    try {
      const incomeType = await this.prismaService.incomeTypes.create({
        data: {
          ...createIncomeTypeDto,
          userId: user.id,
        },
        select: this.selectOptions,
      });
      return incomeType;
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Income Type',
        createIncomeTypeDto.name,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const skip = (page - 1) * limit;
      const total = await this.prismaService.incomeTypes.count();
      const data = await this.prismaService.incomeTypes.findMany({
        where: {
          isDeleted: false,
        },
        select: this.selectOptions,
        skip,
        take: limit,
      });
      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Income Type', '');
    }
  }

  async update(
    id: string,
    updateIncomeTypeDto: UpdateIncomeTypeDto,
    user: Users,
  ) {
    try {
      if (isUUID(id)) {
        return this.prismaService.incomeTypes.update({
          where: { id, isDeleted: false },
          data: {
            ...updateIncomeTypeDto,
            userId: user.id,
          },
          select: this.selectOptions,
        });
      } else {
        throw new BadRequestException('Invalid Income Type ID');
      }
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Income Type', id);
    }
  }

  async remove(id: string, user: Users) {
    try {
      if (isUUID(id)) {
        return this.prismaService.incomeTypes.update({
          where: { id },
          data: {
            userId: user.id,
            isDeleted: true,
          },
          select: this.selectOptions,
        });
      } else {
        throw new BadRequestException('Invalid Income Type ID');
      }
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Income Type', id);
    }
  }
}
