import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersonService } from 'src/person/person.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { isUUID } from 'class-validator';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly personService: PersonService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  private selectOptions = {
    id: true,
    enterDate: true,
    person: {
      select: {
        ciRuc: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        birthDate: true,
      },
    },
  };

  async create(createEmployeeDto: CreateEmployeeDto, user: Users) {
    try {
      const { enterDate, ...createPersonDto } = createEmployeeDto;
      const person = await this.personService.create(createPersonDto, user);
      const employee = await this.prismaService.employees.create({
        data: {
          enterDate: new Date(enterDate),
          personId: person.id,
          userId: user.id,
        },
        select: this.selectOptions,
      });

      return employee;
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Employee',
        createEmployeeDto.ciRuc,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    try {
      const employees = await this.prismaService.employees.findMany({
        take: limit,
        skip: (page - 1) * limit,
        select: this.selectOptions,
      });
      return employees;
    } catch (error) {}
  }

  findOne(term: string) {
    try {
      let employee: Employee;
      if (isUUID(term)) {
        employee = this.prismaService.employees.findUnique({
          where: {
            id: term,
          },
          select: this.selectOptions,
        });
      }
      if (!employee) {
        employee = this.prismaService.employees.findFirst({
          where: {
            person: {
              ciRuc: term,
            },
          },
          select: this.selectOptions,
        });
      }
      if (!employee) {
        employee = this.prismaService.employees.findFirst({
          where: {
            person: {
              name: term,
            },
          },
          select: this.selectOptions,
        });
      }
      if (!employee) {
        employee = this.prismaService.employees.findFirst({
          where: {
            person: {
              email: term,
            },
          },
          select: this.selectOptions,
        });
      }
      if (!employee) {
        employee = this.prismaService.employees.findFirst({
          where: {
            person: {
              phone: term,
            },
          },
          select: this.selectOptions,
        });
      }
      if (!employee)
        throw new BadRequestException(`Employee: ${term} not found`);
      return employee;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Employee', term);
    }
  }

  update(id: string, updateEmployeeDto: UpdateEmployeeDto, user: Users) {
    const { enterDate, ...updatePersonDto } = updateEmployeeDto;
    try {
      const employee = this.prismaService.employees.update({
        where: {
          id,
          isActive: true,
        },
        data: {
          enterDate: new Date(enterDate),
          person: {
            update: { ...updatePersonDto, userId: user.id },
          },
        },
        select: this.selectOptions,
      });
      return employee;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Employee', id);
    }
  }

  remove(id: string, user: Users) {
    try {
      const employee = this.prismaService.employees.update({
        where: {
          id,
          isActive: true,
        },
        data: {
          isActive: false,
          userId: user.id,
        },
      });
      return { message: 'Position deleted successfully' };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Employee', id);
    }
  }
}
