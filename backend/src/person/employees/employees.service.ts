import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employees, Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersonService } from 'src/person/person.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { isUUID } from 'class-validator';
import { createFullDto } from './dto/create-full.dto';
import { FamilyMembersService } from '../family-members/family-members.service';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly personService: PersonService,
    private readonly handleDbErrorService: HandleDbErrorService,
    private readonly familyMembersService: FamilyMembersService,
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
      const totalCount = await this.prismaService.employees.count({
        where: { isDeleted: false },
      });
      const employees = await this.prismaService.employees.findMany({
        take: limit,
        skip: (page - 1) * limit,
        select: this.selectOptions,
        where: {
          isDeleted: false,
        },
      });
      return {
        data: employees,
        currenPage: page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Employee', '');
    }
  }

  findOne(term: string) {
    try {
      let employee;
      if (isUUID(term)) {
        employee = this.prismaService.employees.findUnique({
          where: {
            isDeleted: false,
            id: term,
          },
          select: this.selectOptions,
        });
      }
      if (!employee) {
        employee = this.prismaService.employees.findFirst({
          where: {
            isDeleted: false,
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
            isDeleted: false,

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
            isDeleted: false,

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
            isDeleted: false,

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

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto, user: Users) {
    const { enterDate, ...updatePersonDto } = updateEmployeeDto;
    try {
      const employee = await this.prismaService.employees.update({
        where: {
          id,
          isDeleted: false,
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
          isDeleted: false,
        },
        data: {
          isDeleted: true,
          userId: user.id,
        },
      });
      return { message: 'Position deleted successfully' };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Employee', id);
    }
  }

  async createFull(createFullEmployeeDto: createFullDto, user: Users) {
    console.log('createFullEmployeeDto', createFullEmployeeDto);
    try {
      const { employee: employe, role, familyMembers } = createFullEmployeeDto;
      const employee = await this.create(employe, user);

      const employeeDetail = await this.prismaService.employeeDetails.create({
        data: {
          startDate: new Date(),
          employeeId: employee.id,
          positionId: role.positionId,
          userId: user.id,
        },
      });

      const income = await this.prismaService.income.create({
        data: {
          date: new Date(),
          employeeId: employee.id,
          userId: user.id,
          amount: role.amount,
          active: true,
          incomeTypeId: role.incomeTypeId,
        },
      });

      const familyMembersPromises = familyMembers.map(async (familyMember) => {
        await this.familyMembersService.create(
          {
            ...familyMember,
            employeeId: employee.id,
          },
          user,
        );
      });

      await Promise.all(familyMembersPromises);
      return employee;
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Employee',
        createFullEmployeeDto.employee.ciRuc,
      );
    }
  }
}
