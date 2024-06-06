import { Injectable } from '@nestjs/common';
import { CreateBasicConfigDto } from './dto/create-basic-config.dto';
import { UpdateBasicConfigDto } from './dto/update-basic-config.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Users } from '@prisma/client';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';

@Injectable()
export class BasicConfigService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  private selectOptions = {
    id: true,
    name: true,
    value: true,
  };
  async create(createBasicConfigDto: CreateBasicConfigDto, user: Users) {
    try {
      const config = await this.prismaService.basicConfig.create({
        data: {
          ...createBasicConfigDto,
          userId: user.id,
        },
        select: this.selectOptions,
      });
      return config;
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Config',
        createBasicConfigDto.name,
      );
    }
  }

  async findAll() {
    try {
      const configs = await this.prismaService.basicConfig.findMany({
        select: this.selectOptions,
      });
      return configs;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Config', '');
    }
  }

  async findOne(id: string) {
    try {
      const config = await this.prismaService.basicConfig.findUnique({
        where: { id },
        select: this.selectOptions,
      });
      return config;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Config', id);
    }
  }

  async update(
    id: string,
    updateBasicConfigDto: UpdateBasicConfigDto,
    user: Users,
  ) {
    try {
      const config = await this.prismaService.basicConfig.update({
        where: { id },
        data: {
          ...updateBasicConfigDto,
        },
        select: this.selectOptions,
      });
      return config;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Config', id);
    }
  }
}
