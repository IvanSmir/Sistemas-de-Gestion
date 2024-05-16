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
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Incomes')
@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new income' })
  @ApiResponse({
    status: 201,
    description: 'Income created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createIncomeDto: CreateIncomeDto, @GetUser() user: Users) {
    return this.incomesService.create(createIncomeDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all incomes' })
  @ApiResponse({
    status: 200,
    description: 'Incomes retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.incomesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an income by ID' })
  @ApiResponse({
    status: 200,
    description: 'Income retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Income not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.incomesService.findOne(id);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get incomes by employee ID' })
  @ApiResponse({
    status: 200,
    description: 'Incomes retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  findByEmployeeId(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.incomesService.findAllByEmployee(employeeId, paginationDto);
  }

  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an income' })
  @ApiResponse({
    status: 200,
    description: 'Income updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Income not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
    @GetUser() user: Users,
  ) {
    return this.incomesService.update(id, updateIncomeDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an income' })
  @ApiResponse({
    status: 200,
    description: 'Income deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Income not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: Users) {
    return this.incomesService.remove(id, user);
  }
}
