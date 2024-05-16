import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { Users } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  private selectOptions = {
    id: true,
    ExpenseType: {
      select: {
        name: true,
      },
    },
    amount: true,
    date: true,
    active: true,
  };

  async create(createExpenseDto: CreateExpenseDto, user: Users) {
    try {
      const expense = await this.prismaService.expenses.create({
        data: {
          amount: createExpenseDto.amount,
          date: createExpenseDto.date,
          active: createExpenseDto.active,
          expenseTypeId: createExpenseDto.expenseTypeId,
          employeeId: createExpenseDto.employeeId,
          userId: user.id,
        },
        select: this.selectOptions,
      });
      return expense;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Expense', '');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = limit * (page - 1);
    const take = limit;

    try {
      const expenses = await this.prismaService.expenses.findMany({
        skip,
        take,
        select: this.selectOptions,
        where: {
          isDeleted: false,
          active: true,
        },
      });
      return expenses;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Expenses', '');
    }
  }

  async findAllByEmployee(id: string, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = limit * (page - 1);
    const take = limit;
    try {
      if (!isUUID(id)) throw new BadRequestException('Invalid id');
      const expenses = await this.prismaService.expenses.findMany({
        where: {
          employeeId: id,
          isDeleted: false,
          active: true,
        },
        skip,
        take,
        select: this.selectOptions,
      });
      return expenses;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Expenses', '');
    }
  }

  async findOne(id: string) {
    try {
      const expense = await this.prismaService.expenses.findUnique({
        where: {
          id,
          isDeleted: false,
        },
        select: this.selectOptions,
      });
      return expense;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Expense', id);
    }
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, user: Users) {
    try {
      if (!isUUID(id)) throw new BadRequestException('Invalid id');
      const expense = await this.prismaService.expenses.update({
        where: {
          id,
          isDeleted: false,
        },
        data: {
          amount: updateExpenseDto.amount,
          date: updateExpenseDto.date,
          active: updateExpenseDto.active,
          expenseTypeId: updateExpenseDto.expenseTypeId,
          employeeId: updateExpenseDto.employeeId,
          userId: user.id,
        },
        select: this.selectOptions,
      });
      return expense;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Expense', id);
    }
  }

  async remove(id: string, user: Users) {
    try {
      if (!isUUID(id)) throw new BadRequestException('Invalid id');
      const expense = await this.prismaService.expenses.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
          userId: user.id,
        },
        select: this.selectOptions,
      });
      return expense;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Expense', id);
    }
  }
}
