// src/employees/employees.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    return this.prisma.employees.create({
      data: createEmployeeDto,
    });
  }

  findAll() {
    return this.prisma.employees.findMany();
  }

  findOne(id: string) {
    return this.prisma.employees.findUnique({
      where: { id },
    });
  }

  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.prisma.employees.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  remove(id: string) {
    return this.prisma.employees.delete({
      where: { id },
    });
  }
}
