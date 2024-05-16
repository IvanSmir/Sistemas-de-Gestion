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
import { IncomeTypesService } from './income-types.service';
import { CreateIncomeTypeDto } from './dto/create-income-type.dto';
import { UpdateIncomeTypeDto } from './dto/update-income-type.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Income Types')
@Controller('income-types')
export class IncomeTypesController {
  constructor(private readonly incomeTypesService: IncomeTypesService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new income type' })
  @ApiResponse({
    status: 201,
    description: 'Income type created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(
    @Body() createIncomeTypeDto: CreateIncomeTypeDto,
    @GetUser() user: Users,
  ) {
    return this.incomeTypesService.create(createIncomeTypeDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all income types' })
  @ApiResponse({
    status: 200,
    description: 'Income types retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.incomeTypesService.findAll(paginationDto);
  }

  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an income type' })
  @ApiResponse({
    status: 200,
    description: 'Income type updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Income type not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIncomeTypeDto: UpdateIncomeTypeDto,
    @GetUser() user: Users,
  ) {
    return this.incomeTypesService.update(id, updateIncomeTypeDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an income type' })
  @ApiResponse({
    status: 200,
    description: 'Income type deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Income type not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: Users) {
    return this.incomeTypesService.remove(id, user);
  }
}
