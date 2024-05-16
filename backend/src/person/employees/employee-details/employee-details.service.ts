import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDetailDto } from './dto/create-employee-detail.dto';
import { UpdateEmployeeDetailDto } from './dto/update-employee-detail.dto';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class EmployeeDetailsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  private selectOptions = {
    id: true,
    employeeId: true,
    position: {
      select: {
        name: true,
      },
    },
    startDate: true,
    endDate: true,
  };
  async create(createEmployeeDetailDto: CreateEmployeeDetailDto, user: Users) {
    try {
      const employeeDetail = await this.prisma.employeeDetails.create({
        data: {
          ...createEmployeeDetailDto,
          userId: user.id,
        },
        select: this.selectOptions,
      });

      return employeeDetail;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'EmployeeDetail', '');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    try {
      const employeeDetails = await this.prisma.employeeDetails.findMany({
        select: this.selectOptions,
        take: limit,
        skip: (page - 1) * limit,
        where: {
          isDeleted: false,
        },
      });
      return employeeDetails;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'EmployeeDetail', '');
    }
  }

  async findAllByEmployeeId(employeeId: string) {
    try {
      if (isUUID(employeeId)) {
        const employeeDetails = await this.prisma.employeeDetails.findMany({
          where: {
            employeeId,
            isDeleted: false,
          },
          select: this.selectOptions,
        });
        return employeeDetails;
      }
      throw new BadRequestException('Invalid term');
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'EmployeeDetail',
        employeeId,
      );
    }
  }

  async findOne(id: string) {
    try {
      if (isUUID(id)) {
        const employeeDetail = await this.prisma.employeeDetails.findUnique({
          where: {
            id,
            isDeleted: false,
          },
          select: this.selectOptions,
        });
        if (!employeeDetail)
          throw new BadRequestException('EmployeeDetail not found');
        return employeeDetail;
      }
      throw new BadRequestException('Invalid term');
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'EmployeeDetail', id);
    }
  }

  async update(
    id: string,
    updateEmployeeDetailDto: UpdateEmployeeDetailDto,
    user: Users,
  ) {
    try {
      if (!isUUID(id)) throw new BadRequestException('Invalid term');
      const employeeDetail = await this.prisma.employeeDetails.update({
        where: { id, isDeleted: false },
        data: { ...updateEmployeeDetailDto, userId: user.id },
        select: this.selectOptions,
      });
      if (!employeeDetail)
        throw new BadRequestException('EmployeeDetail not found');
      return employeeDetail;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'EmployeeDetail', id);
    }
  }

  async deactivate(id: string, user: Users) {
    try {
      if (!isUUID(id)) throw new BadRequestException('Invalid term');
      const employeeDetail = await this.prisma.employeeDetails.update({
        where: { id, isDeleted: false },
        data: { endDate: new Date(), userId: user.id, isActive: false },
        select: this.selectOptions,
      });
      if (!employeeDetail)
        throw new BadRequestException('EmployeeDetail not found');
      return employeeDetail;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'EmployeeDetail', id);
    }
  }

  async remove(id: string, user: Users) {
    try {
      if (!isUUID(id)) throw new BadRequestException('Invalid term');
      const employeeDetail = await this.prisma.employeeDetails.update({
        where: { id, isDeleted: false },
        data: { isDeleted: true, userId: user.id },
        select: this.selectOptions,
      });
      if (!employeeDetail)
        throw new BadRequestException('EmployeeDetail not found');
      return employeeDetail;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'EmployeeDetail', id);
    }
  }
}