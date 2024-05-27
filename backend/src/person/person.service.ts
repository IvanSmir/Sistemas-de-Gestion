import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { Person, Users } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { UpdatePersonDto } from './dto/update-person.dto';
import { isUUID } from 'class-validator';
import { join } from 'path';
import { FindPersonDto } from './dto/find-person.dto';

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
      const { userId, createdAt, updatedAt, isDeleted, ...sanitizedPerson } =
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

  async findOne(ciRuc: string) {
    try {
      let person;
      person = await this.prismaService.person.findUnique({
        where: {
          ciRuc: ciRuc,
          isDeleted: false,
        },
        select: {
          id: true,
          ciRuc: true,
          name: true,
          birthDate: true,
          email: true,
          phone: true,
          address: true,
          gender: true,
        },
      });

      if (!person) {
        throw new NotFoundException(`Person: ${ciRuc} not found`);
      }
      const isEmployee = await this.prismaService.employees.findFirst({
        where: {
          personId: person.id,
        },
      });
      if (isEmployee) {
        return {
          ...person,
          enterDate: isEmployee.enterDate,
          isEmployee: true,
          idEmployee: isEmployee.id,
        };
      }
      return {
        ...person,
        isEmployee: false,
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Person', ciRuc);
    }
  }

  async update(id: string, updatePersonDto: UpdatePersonDto, user: Users) {
    try {
      const person = await this.prismaService.person.update({
        where: { id, isDeleted: false },
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
        where: { id, isDeleted: false },
        data: { isDeleted: true, userId: user.id },
      });
      return { message: 'Person deleted successfully' };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Person', id);
    }
  }
}
