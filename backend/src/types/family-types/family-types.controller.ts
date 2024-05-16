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
} from '@nestjs/swagger';
import { FamilyTypesService } from './family-types.service';
import { CreateFamilyTypeDto } from './dto/create-family-type.dto';
import { UpdateFamilyTypeDto } from './dto/update-family-type.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Family Types')
@Controller('family-types')
export class FamilyTypesController {
  constructor(private readonly familyTypesService: FamilyTypesService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new family type' })
  @ApiResponse({
    status: 201,
    description: 'Family type created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() createFamilyTypeDto: CreateFamilyTypeDto,
    @GetUser() user: Users,
  ) {
    return this.familyTypesService.create(createFamilyTypeDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all family types' })
  @ApiResponse({
    status: 200,
    description: 'Family types retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.familyTypesService.findAll(paginationDto);
  }

  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a family type' })
  @ApiResponse({
    status: 200,
    description: 'Family type updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Family type not found.' })
  update(
    @Param('id') id: string,
    @Body() updateFamilyTypeDto: UpdateFamilyTypeDto,
    @GetUser() user: Users,
  ) {
    return this.familyTypesService.update(id, updateFamilyTypeDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a family type' })
  @ApiResponse({
    status: 200,
    description: 'Family type deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Family type not found.' })
  remove(@Param('id') id: string, @GetUser() user: Users) {
    return this.familyTypesService.remove(id, user);
  }
}
