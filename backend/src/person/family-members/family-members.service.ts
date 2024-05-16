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
      const { familyTypeId, employeeId, ...CreatePersonDto } =
        createFamilyMemberDto;
      const person = await this.personService.create(CreatePersonDto, user);
      const familyMember = await this.prismaService.familyMembers.create({
        data: {
          familyTypeId,
          employeeId,
          personId: person.id,
          userId: user.id,
        },
        select: this.selectOptions,
      });
      return familyMember;
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
      const familyMembers = await this.prismaService.familyMembers.findMany({
        where: {
          isDeleted: false,
        },
        skip: page - 1,
        take: limit,
        select: this.selectOptions,
      });
      return familyMembers;
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
            isDeleted: false,
            id: term,
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

  async update(
    id: string,
    updateFamilyMemberDto: UpdateFamilyMemberDto,
    user: Users,
  ) {
    const { familyTypeId, employeeId, ...updatePersonDto } =
      updateFamilyMemberDto;
    try {
      let familyMember;
      if (familyTypeId) {
        familyMember = await this.prismaService.familyMembers.update({
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
        familyMember = await this.prismaService.familyMembers.update({
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
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Family Member', id);
    }
  }

  async remove(id: string, user: Users) {
    try {
      const familyMember = await this.prismaService.familyMembers.update({
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
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Family Member', id);
    }
  }
}
