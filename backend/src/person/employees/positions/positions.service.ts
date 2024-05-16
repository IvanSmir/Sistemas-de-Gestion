import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Positions, Users } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';

@Injectable()
export class PositionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  create(createPositionDto: CreatePositionDto, user: Users) {
    try {
      return this.prismaService.positions.create({
        data: {
          ...createPositionDto,
          userId: user.id,
        },
      });
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Position',
        createPositionDto.name,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const offset = (page - 1) * limit;

    try {
      const totalCount = await this.prismaService.positions.count();
      const positions = await this.prismaService.positions.findMany({
        where: { isDeleted: false },
        select: {
          id: true,
          description: true,
          name: true,
        },
        take: limit,
        skip: offset,
      });

      return {
        data: positions,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Position', '');
    }
  }

  async findOne(term: string) {
    try {
      let positions: Positions;
      if (isUUID(term)) {
        positions = await this.prismaService.positions.findUnique({
          where: {
            id: term,
            isDeleted: false,
          },
        });
      }
      if (!positions) {
        positions = await this.prismaService.positions.findFirst({
          where: {
            name: {
              equals: term.toLowerCase(),
              mode: 'insensitive',
            },
            isDeleted: false,
          },
        });
      }
      if (!positions) {
        throw new BadRequestException(`Position: ${term} not found`);
      }
      const { userId, createdAt, updatedAt, isDeleted, ...result } = positions;
      return result;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Position', term);
    }
  }

  async update(id: string, updatePositionDto: UpdatePositionDto, user: Users) {
    try {
      const updatePosition = await this.prismaService.positions.update({
        where: {
          id,
          isDeleted: false,
        },
        data: { ...updatePositionDto, userId: user.id },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });
      return updatePosition;
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Position',
        updatePositionDto.name,
      );
    }
  }

  async remove(id: string, user: Users) {
    try {
      await this.prismaService.positions.update({
        where: {
          id,
          isDeleted: false,
        },
        data: {
          isDeleted: true,
          userId: user.id,
        },
      });
      return { message: 'Position deleted successfully' };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Position', id);
    }
  }

  // private handleDbError(error: any) {
  //   if (error.code === 'P2002') {
  //     throw new BadRequestException('Position already exists');
  //   }
  //   if (error.code === 'P2025') {
  //     throw new BadRequestException('Position not found');
  //   }
  //   throw new InternalServerErrorException(
  //     'An error occurred while processing the request, please try again later.',
  //   );
  // }
}
