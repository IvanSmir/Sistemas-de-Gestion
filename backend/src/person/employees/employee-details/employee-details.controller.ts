import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { EmployeeDetailsService } from './employee-details.service';
import { CreateEmployeeDetailDto } from './dto/create-employee-detail.dto';
import { UpdateEmployeeDetailDto } from './dto/update-employee-detail.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Employee details')
@Controller('employee-details')
export class EmployeeDetailsController {
  constructor(
    private readonly employeeDetailsService: EmployeeDetailsService,
  ) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new employee detail' })
  @ApiResponse({
    status: 201,
    description: 'Employee detail created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(
    @Body() createEmployeeDetailDto: CreateEmployeeDetailDto,
    @GetUser() user: Users,
  ) {
    return this.employeeDetailsService.create(createEmployeeDetailDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employee details' })
  @ApiResponse({ status: 200, description: 'List of employee details.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  findAll(@Body() paginationDto: PaginationDto) {
    return this.employeeDetailsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Get an employee detail by term' })
  @ApiParam({
    name: 'term',
    description: 'ID or search term of the employee detail',
  })
  @ApiResponse({
    status: 200,
    description: 'Employee detail retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Employee detail not found.' })
  findOne(@Param('term') term: string) {
    return this.employeeDetailsService.findOne(term);
  }

  @Get('employee/:id')
  @ApiOperation({ summary: 'Get employee details by employee ID' })
  @ApiParam({ name: 'id', description: 'ID of the employee' })
  @ApiResponse({
    status: 200,
    description: 'Employee details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Employee details not found.' })
  findByEmployeeId(@Param('id') id: string) {
    return this.employeeDetailsService.findAllByEmployeeId(id);
  }

  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an employee detail' })
  @ApiParam({ name: 'id', description: 'ID of the employee detail' })
  @ApiResponse({
    status: 200,
    description: 'Employee details retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Employee detail not found.' })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDetailDto: UpdateEmployeeDetailDto,
    @GetUser() user: Users,
  ) {
    return this.employeeDetailsService.update(
      id,
      updateEmployeeDetailDto,
      user,
    );
  }

  @Delete('/deactivate/:id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate an employee detail' })
  @ApiParam({ name: 'id', description: 'ID of the employee detail' })
  @ApiResponse({
    status: 200,
    description: 'Employee detail successfully deactivated.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Employee detail not found.' })
  deactivate(@Param('id') id: string, @GetUser() user: Users) {
    return this.employeeDetailsService.deactivate(id, user);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove an employee detail' })
  @ApiParam({ name: 'id', description: 'ID of the employee detail' })
  @ApiResponse({
    status: 200,
    description: 'Employee detail deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Employee detail not found.' })
  remove(@Param('id') id: string, @GetUser() user: Users) {
    return this.employeeDetailsService.remove(id, user);
  }
}
