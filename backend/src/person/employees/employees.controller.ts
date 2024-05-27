import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { createFullDto } from './dto/create-full.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: 201, description: 'Employee created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createEmployeeDto: CreateEmployeeDto, @GetUser() user: Users) {
    return this.employeesService.create(createEmployeeDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({
    status: 200,
    description: 'Employees retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query() paginationDto: PaginationDto) {
    console.log('paginationDto', paginationDto);
    return this.employeesService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Get an employee by term' })
  @ApiResponse({ status: 200, description: 'Employee retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  findOne(@Param('term') term: string) {
    return this.employeesService.findOne(term);
  }

  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an employee' })
  @ApiResponse({ status: 200, description: 'Employee updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @GetUser() user: Users,
  ) {
    return this.employeesService.update(id, updateEmployeeDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiResponse({ status: 200, description: 'Employee deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  remove(@Param('id') id: string, @GetUser() user: Users) {
    return this.employeesService.remove(id, user);
  }

  @Post('complete')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete an employee' })
  @ApiResponse({ status: 200, description: 'Employee completed successfully.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  complete(@Body() createFullEmployeeDto, @GetUser() user: Users) {
    return this.employeesService.createFull(createFullEmployeeDto, user);
  }
}
