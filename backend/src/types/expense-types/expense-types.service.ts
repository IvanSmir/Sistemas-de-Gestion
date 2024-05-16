import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { Users } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ExpenseTypesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  private selectOptions = {
    id: true,
    name: true,
  };

  async create(createExpenseTypeDto: CreateExpenseTypeDto, user: Users) {
    try {
      const expenseType = await this.prismaService.expenseTypes.create({
        data: {
          ...createExpenseTypeDto,
          userId: user.id,
        },
        select: this.selectOptions,
      });
      return expenseType;
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Expense Type',
        createExpenseTypeDto.name,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const totalCount = await this.prismaService.expenseTypes.count();
      const expenseTypes = await this.prismaService.expenseTypes.findMany({
        select: this.selectOptions,
        where: {
          isDeleted: false,
        },
        skip,
        take: limit,
      });
      return {
        data: expenseTypes,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Expense Type', '');
    }
  }

  async update(
    id: string,
    updateExpenseTypeDto: UpdateExpenseTypeDto,
    user: Users,
  ) {
    try {
      if (isUUID(id)) {
        const expenseType = await this.prismaService.expenseTypes.update({
          where: {
            id,
            isDeleted: false,
          },
          data: {
            ...updateExpenseTypeDto,
            userId: user.id,
          },
          select: this.selectOptions,
        });
        return expenseType;
      } else {
        throw new BadRequestException('Invalid Expense Type ID');
      }
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Expense Type',
        updateExpenseTypeDto.name,
      );
    }
  }

  async remove(id: string, user: Users) {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException('Invalid Expense Type ID');
      }
      return this.prismaService.expenseTypes.update({
        where: {
          id,
        },
        data: {
          userId: user.id,
          isDeleted: true,
        },
      });
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Expense Type', '');
    }
  }
}
