import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({
    status: 201,
    description: 'Expense created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createExpenseDto: CreateExpenseDto, @GetUser() user: Users) {
    return this.expensesService.create(createExpenseDto, user);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({
    status: 200,
    description: 'Expenses retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.expensesService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Get an expense by ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.findOne(id);
  }

  @Get('employee/:employeeId')
  @Auth()
  @ApiOperation({ summary: 'Get expenses by employee ID' })
  @ApiResponse({
    status: 200,
    description: 'Expenses retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  findByEmployeeId(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.expensesService.findAllByEmployee(employeeId, paginationDto);
  }

  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an expense' })
  @ApiResponse({
    status: 200,
    description: 'Expense updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @GetUser() user: Users,
  ) {
    return this.expensesService.update(id, updateExpenseDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({
    status: 200,
    description: 'Expense deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: Users) {
    return this.expensesService.remove(id, user);
  }
}
