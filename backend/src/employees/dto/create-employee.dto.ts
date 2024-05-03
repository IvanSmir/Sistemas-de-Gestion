// src/employees/dto/create-employee.dto.ts
import { OmitType } from '@nestjs/mapped-types';
import { Employee } from '../entities/employee.entity';

export class CreateEmployeeDto extends OmitType(Employee, ['id'] as const) {}
