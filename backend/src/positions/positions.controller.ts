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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new position' })
  @ApiResponse({ status: 201, description: 'Position created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreatePositionDto })
  create(@Body() createPositionDto: CreatePositionDto, @GetUser() user: Users) {
    return this.positionsService.create(createPositionDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all positions' })
  @ApiResponse({
    status: 200,
    description: 'Positions retrieved successfully.',
    type: [CreatePositionDto],
  })
  findAll(@Param() paginationDto: PaginationDto) {
    return this.positionsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Find a position by term' })
  @ApiParam({ name: 'term', type: 'string', description: 'Search term' })
  @ApiResponse({ status: 200, description: 'Position found.' })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  findOne(@Param('term') term: string) {
    return this.positionsService.findOne(term);
  }

  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a position' })
  @ApiParam({ name: 'id', type: 'string', description: 'Position ID' })
  @ApiResponse({ status: 200, description: 'Position updated successfully.' })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
    @GetUser() user: Users,
  ) {
    return this.positionsService.update(id, updatePositionDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a position' })
  @ApiParam({ name: 'id', type: 'string', description: 'Position ID' })
  @ApiResponse({ status: 200, description: 'Position deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string, @GetUser() user: Users) {
    return this.positionsService.remove(id, user);
  }
}
