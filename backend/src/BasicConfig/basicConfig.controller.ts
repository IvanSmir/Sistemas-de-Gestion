import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BasicConfigService } from './basicConfig.service';
import { CreateBasicConfigDto } from './dto/create-basic-config.dto';
import { UpdateBasicConfigDto } from './dto/update-basic-config.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Config')
@Controller('config')
export class BasicConfigController {
  constructor(private readonly configService: BasicConfigService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new configuration' })
  @ApiResponse({
    status: 201,
    description: 'Configuration created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() createConfigDto: CreateBasicConfigDto,
    @GetUser() user: Users,
  ) {
    return this.configService.create(createConfigDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all configurations' })
  @ApiResponse({
    status: 200,
    description: 'Configurations retrieved successfully.',
  })
  findAll() {
    return this.configService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a configuration by ID' })
  @ApiResponse({
    status: 200,
    description: 'Configuration retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Configuration not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.configService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a configuration' })
  @ApiResponse({
    status: 200,
    description: 'Configuration updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Configuration not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConfigDto: UpdateBasicConfigDto,
    @GetUser() user: Users,
  ) {
    return this.configService.update(id, updateConfigDto, user);
  }
}
