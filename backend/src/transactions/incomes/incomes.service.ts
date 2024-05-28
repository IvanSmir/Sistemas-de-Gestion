import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { Users } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class IncomesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  private selectOptions = {
    id: true,
    incomeType: {
      select: {
        name: true,
        deductible: true,
      },
    },
    amount: true,
    date: true,
    active: true,
  };

  async create(createIncomeDto: CreateIncomeDto, user: Users) {
    try {
      const income = await this.prismaService.income.create({
        data: {
          amount: createIncomeDto.amount,
          date: createIncomeDto.date,
          active: createIncomeDto.active,
          incomeTypeId: createIncomeDto.incomeTypeId,
          employeeId: createIncomeDto.employeeId,
          userId: user.id,
        },
        select: this.selectOptions,
      });
      return income;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Income', '');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = limit * (page - 1);
    const take = limit;

    try {
      const totalCount = await this.prismaService.income.count({
        where: { isDeleted: false },
      });

      const incomes = await this.prismaService.income.findMany({
        skip,
        take,
        select: this.selectOptions,
        where: {
          isDeleted: false,
          active: true,
        },
      });
      return {
        data: incomes,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Incomes', '');
    }
  }

  async findAllByEmployee(id: string, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = limit * (page - 1);
    const take = limit;
    try {
      if (!isUUID(id)) throw new BadRequestException('Invalid id');
      const incomes = await this.prismaService.income.findMany({
        where: {
          employeeId: id,
          isDeleted: false,
          active: true,
        },
        skip,
        take,
        select: this.selectOptions,
      });
      return incomes;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Incomes', '');
    }
  }

  async findOne(id: string) {
    try {
      const income = await this.prismaService.income.findUnique({
        where: {
          id,
          isDeleted: false,
        },
        select: this.selectOptions,
      });
      return income;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Income', id);
    }
  }

  async update(id: string, updateIncomeDto: UpdateIncomeDto, user: Users) {
    try {
      if (!isUUID(id)) throw new BadRequestException('Invalid id');
      const income = await this.prismaService.income.update({
        where: {
          id,
          isDeleted: false,
        },
        data: {
          amount: updateIncomeDto.amount,
          date: updateIncomeDto.date,
          active: updateIncomeDto.active,
          incomeTypeId: updateIncomeDto.incomeTypeId,
          employeeId: updateIncomeDto.employeeId,
          userId: user.id,
        },
        select: this.selectOptions,
      });
      return income;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Income', id);
    }
  }

  async remove(id: string, user: Users) {
    try {
      if (!isUUID(id)) throw new BadRequestException('Invalid id');
      const income = await this.prismaService.income.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
          userId: user.id,
        },
        select: this.selectOptions,
      });
      return income;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Income', id);
    }
  }
}
