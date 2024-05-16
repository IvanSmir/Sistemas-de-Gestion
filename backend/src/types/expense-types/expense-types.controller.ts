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
import { ExpenseTypesService } from './expense-types.service';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Expense Types')
@Controller('expense-types')
export class ExpenseTypesController {
  constructor(private readonly expenseTypesService: ExpenseTypesService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new expense type' })
  @ApiResponse({
    status: 201,
    description: 'Expense type created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(
    @Body() createExpenseTypeDto: CreateExpenseTypeDto,
    @GetUser() user: Users,
  ) {
    return this.expenseTypesService.create(createExpenseTypeDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expense types' })
  @ApiResponse({
    status: 200,
    description: 'Expense types retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.expenseTypesService.findAll(paginationDto);
  }

  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an expense type' })
  @ApiResponse({
    status: 200,
    description: 'Expense type updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Expense type not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenseTypeDto: UpdateExpenseTypeDto,
    @GetUser() user: Users,
  ) {
    return this.expenseTypesService.update(id, updateExpenseTypeDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an expense type' })
  @ApiResponse({
    status: 200,
    description: 'Expense type deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Expense type not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: Users) {
    return this.expenseTypesService.remove(id, user);
  }
}
