import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { Person, Users } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';

@Injectable()
export class PersonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  async create(createPersonDto: CreatePersonDto, user: Users) {
    try {
      const person = await this.prismaService.person.create({
        data: { ...createPersonDto, userId: user.id },
      });
      const { userId, createdAt, updatedAt, isActive, ...sanitizedPerson } =
        person;

      return sanitizedPerson;
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Person',
        createPersonDto.ciRuc,
      );
      console.error(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const offset = (page - 1) * limit;

      const totalCount = await this.prismaService.person.count();
      const persons = await this.prismaService.person.findMany({
        take: limit,
        skip: offset,
        select: {
          id: true,
          ciRuc: true,
          name: true,
          birthDate: true,
        },
      });
      return {
        data: persons,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Person', '');
    }
  }

  async findOne(term: string) {
    try {
      let person: Person;
      if (term.length === 10 || term.length === 13) {
        person = await this.prismaService.person.findUnique({
          where: {
            ciRuc: term,
            isActive: true,
          },
        });
      } else {
        person = await this.prismaService.person.findUnique({
          where: {
            id: term,
            isActive: true,
          },
        });
      }
      return person;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Person', term);
    }
  }

  async update(id: string, updatePersonDto: CreatePersonDto, user: Users) {
    try {
      const person = await this.prismaService.person.update({
        where: { id, isActive: true },
        data: { ...updatePersonDto, userId: user.id },
      });
      return person;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Person', id);
    }
  }

  async remove(id: string, user: Users) {
    try {
      await this.prismaService.person.update({
        where: { id, isActive: true },
        data: { isActive: false, userId: user.id },
      });
      return { message: 'Person deleted successfully' };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Person', id);
    }
  }

  // private handleDbError(e: any) {
  //   console.error(e);
  //   if (e.code === 'P2002') {
  //     throw new BadRequestException('The provided CI/RUC is already in use');
  //   }

  //   if (e.code === 'P2025') {
  //     throw new BadRequestException('The provided user does not exist');
  //   }

  //   throw new InternalServerErrorException(
  //     'An error occurred while processing the request, please try again later.',
  //   );
  // }
}
