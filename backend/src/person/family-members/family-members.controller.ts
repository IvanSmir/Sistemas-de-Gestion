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
import { FamilyMembersService } from './family-members.service';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { UpdateFamilyMemberDto } from './dto/update-family-member.dto';
import { Users } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Family Members')
@Controller('family-members')
export class FamilyMembersController {
  constructor(private readonly familyMembersService: FamilyMembersService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new family member' })
  @ApiResponse({
    status: 201,
    description: 'Family member created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(
    @Body() createFamilyMemberDto: CreateFamilyMemberDto,
    @GetUser() user: Users,
  ) {
    return this.familyMembersService.create(createFamilyMemberDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all family members' })
  @ApiResponse({
    status: 200,
    description: 'Family members retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.familyMembersService.findAll(paginationDto);
  }

  @Get('/employee/:id')
  @ApiOperation({ summary: 'Get family members by employee ID' })
  @ApiResponse({
    status: 200,
    description: 'Family members retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  findByEmployeeId(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.familyMembersService.findAllByEmployee(id, paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Get a family member by term' })
  @ApiResponse({
    status: 200,
    description: 'Family member retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Family member not found.' })
  findOne(@Param('term') term: string) {
    return this.familyMembersService.findOne(term);
  }
  
  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a family member' })
  @ApiResponse({
    status: 200,
    description: 'Family member updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Family member not found.' })
  update(
    @Param('id') id: string,
    @Body() updateFamilyMemberDto: UpdateFamilyMemberDto,
    @GetUser() user: Users,
  ) {
    return this.familyMembersService.update(id, updateFamilyMemberDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a family member' })
  @ApiResponse({
    status: 200,
    description: 'Family member deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Family member not found.' })
  remove(@Param('id') id: string, @GetUser() user: Users) {
    return this.familyMembersService.remove(id, user);
  }
}
