import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employees, Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersonService } from 'src/person/person.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { isUUID } from 'class-validator';
import { CreateFullDto } from './dto/create-full.dto';
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
        gender: true,
      },
    },
  };

  async create(createEmployeeDto: CreateEmployeeDto, user: Users) {
    try {
      const { enterDate, ...createPersonDto } = createEmployeeDto;
      const result = await this.prismaService.$transaction(async (prisma) => {
        const person = await this.personService.create(createPersonDto, user);
        const employee = await prisma.employees.create({
          data: {
            enterDate: new Date(enterDate),
            personId: person.id,
            userId: user.id,
          },
          select: this.selectOptions,
        });

        return employee;
      });

      return result;
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
        orderBy: {
          createdAt: 'desc',
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

  async findOne(term: string) {
    try {
      let employee;
      if (isUUID(term)) {
        employee = await this.prismaService.employees.findUnique({
          where: {
            id: term,
            isDeleted: false,
          },
          select: this.selectOptions,
        });
      }
      if (!employee) {
        employee = await this.prismaService.employees.findFirst({
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
        employee = await this.prismaService.employees.findFirst({
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
        employee = await this.prismaService.employees.findFirst({
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
        employee = await this.prismaService.employees.findFirst({
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
      const result = await this.prismaService.$transaction(async (prisma) => {
        const employee = await prisma.employees.update({
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
      });

      return result;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Employee', id);
    }
  }

  async remove(id: string, user: Users) {
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        const employee = await prisma.employees.update({
          where: {
            id,
            isDeleted: false,
          },
          data: {
            isDeleted: true,
            userId: user.id,
          },
        });

        return { message: 'Employee deleted successfully' };
      });

      return result;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Employee', id);
    }
  }
  async createFull(createFullEmployeeDto: CreateFullDto, user: Users) {
    try {
      const {
        employee: employe,
        role,
        familyMembers,
        isNew,
      } = createFullEmployeeDto;

      const result = await this.prismaService.$transaction(
        async (prisma) => {
          let employee;
          if (isNew) {
            employee = await this.create(employe, user);
          } else {
            const person = await this.personService.findOne(employe.ciRuc);
            employee = await prisma.employees.create({
              data: {
                enterDate: new Date(employe.enterDate),
                personId: person.id,
                userId: user.id,
              },
              select: this.selectOptions,
            });
          }

          await prisma.employeeDetails.create({
            data: {
              startDate: new Date(),
              employeeId: employee.id,
              positionId: role.positionId,
              userId: user.id,
              salary: role.amount,
              salaryType: role.salaryType,
            },
          });

          for (const familyMember of familyMembers) {
            if (familyMember.isNew) {
              const { isNew, ...familyMemberDto } = familyMember;
              await this.familyMembersService.create(
                {
                  ...familyMemberDto,
                  employeeId: employee.id,
                },
                user,
              );
            } else {
              const person = await this.personService.findOne(
                familyMember.ciRuc,
              );
              await prisma.familyMembers.create({
                data: {
                  employeeId: employee.id,
                  familyTypeId: familyMember.familyTypeId,
                  personId: person.id,
                  userId: user.id,
                },
              });
            }
          }

          return employee;
        },
        { timeout: 60000 },
      ); // Aumentar el tiempo de espera a 60 segundos

      return result;
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Employee',
        createFullEmployeeDto.employee.ciRuc,
      );
      throw error;
    }
  }
}
