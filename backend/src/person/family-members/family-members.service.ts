import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { UpdateFamilyMemberDto } from './dto/update-family-member.dto';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { PersonService } from 'src/person/person.service';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class FamilyMembersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
    private readonly personService: PersonService,
  ) {}

  private selectOptions = {
    id: true,
    familyType: {
      select: {
        name: true,
      },
    },
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

  async create(createFamilyMemberDto: CreateFamilyMemberDto, user: Users) {
    try {
      const { familyTypeId, employeeId, ...createPersonDto } =
        createFamilyMemberDto;
      const result = await this.prismaService.$transaction(async (prisma) => {
        const person = await this.personService.create(createPersonDto, user);
        const familyMember = await prisma.familyMembers.create({
          data: {
            familyTypeId,
            employeeId,
            personId: person.id,
            userId: user.id,
          },
          select: this.selectOptions,
        });
        return familyMember;
      });
      return result;
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'Family Member',
        createFamilyMemberDto.ciRuc,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const totalCount = await this.prismaService.familyMembers.count({
        where: { isDeleted: false },
      });
      const familyMembers = await this.prismaService.familyMembers.findMany({
        where: {
          isDeleted: false,
        },
        skip: (page - 1) * limit,
        take: limit,
        select: this.selectOptions,
      });
      return {
        data: familyMembers,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Family Member', '');
    }
  }

  async findOne(term: string) {
    try {
      let familyMember;
      if (isUUID(term)) {
        familyMember = await this.prismaService.familyMembers.findUnique({
          where: {
            id: term,
            isDeleted: false,
          },
          select: this.selectOptions,
        });
      }
      if (!familyMember) {
        familyMember = await this.prismaService.familyMembers.findFirst({
          where: {
            isDeleted: false,
            person: {
              ciRuc: term,
            },
          },
          select: this.selectOptions,
        });
      }
      if (!familyMember) {
        familyMember = await this.prismaService.familyMembers.findFirst({
          where: {
            isDeleted: false,
            person: {
              name: term,
            },
          },
          select: this.selectOptions,
        });
      }
      if (!familyMember) {
        familyMember = await this.prismaService.familyMembers.findFirst({
          where: {
            isDeleted: false,
            person: {
              email: term,
            },
          },
          select: this.selectOptions,
        });
      }
      if (!familyMember) {
        familyMember = await this.prismaService.familyMembers.findFirst({
          where: {
            isDeleted: false,
            person: {
              phone: term,
            },
          },
          select: this.selectOptions,
        });
      }
      if (!familyMember)
        throw new BadRequestException(`Family Member: ${term} not found`);
      return familyMember;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Family Member', term);
    }
  }

  async findAllByEmployee(id: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    try {
      console.log('id', id);
      if (!isUUID(id)) throw new BadRequestException('Invalid id');
      const familyMembers = await this.prismaService.familyMembers.findMany({
        where: {
          isDeleted: false,
          employeeId: id,
        },
        skip: (page - 1) * limit,
        take: limit,
        select: this.selectOptions,
      });
      const totalCount = await this.prismaService.familyMembers.count({
        where: {
          isDeleted: false,
          employeeId: id,
        },
      });
      return {
        data: familyMembers,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Family Member', '');
    }
  }

  async update(
    id: string,
    updateFamilyMemberDto: UpdateFamilyMemberDto,
    user: Users,
  ) {
    const { familyTypeId, employeeId, ...updatePersonDto } =
      updateFamilyMemberDto;
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        let familyMember;
        if (familyTypeId) {
          familyMember = await prisma.familyMembers.update({
            where: {
              id: id,
              isDeleted: false,
            },
            data: {
              familyTypeId,
            },
            select: this.selectOptions,
          });
        }
        if (updatePersonDto) {
          familyMember = await prisma.familyMembers.update({
            where: {
              id: id,
              isDeleted: false,
            },
            data: {
              person: {
                update: { ...updatePersonDto, userId: user.id },
              },
            },
            select: this.selectOptions,
          });
        }
        return familyMember;
      });
      return result;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Family Member', id);
    }
  }

  async remove(id: string, user: Users) {
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        const familyMember = await prisma.familyMembers.update({
          where: {
            id,
            isDeleted: false,
          },
          data: {
            userId: user.id,
            isDeleted: true,
          },
          select: this.selectOptions,
        });
        return familyMember;
      });
      return result;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Family Member', id);
    }
  }
}
