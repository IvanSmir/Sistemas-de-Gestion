import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsUUID } from 'class-validator';

enum SalaryType {
  MINIMUM = 'minimum',
  BASE = 'base',
}

export class CreateEmployeeDetailDto {
  @IsUUID()
  @ApiProperty({
    type: String,
    description: 'The uuid of the employee',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  employeeId: string;

  @IsUUID()
  @ApiProperty({
    type: String,
    description: 'The uuid of the position',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  positionId: string;

  @IsDate()
  @ApiProperty({
    type: Date,
    description: 'The start date of the position',
    example: '2021-09-01T00:00:00Z',
  })
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsEnum(SalaryType)
  @ApiProperty({
    type: Boolean,
    description: 'Whether the salary is minimum or base',
    example: SalaryType.BASE,
  })
  salaryType: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'The salary of the employee',
    example: 100,
  })
  salary: number;

  @IsDate()
  @ApiProperty({
    type: Date,
    description: 'The end date of the position',
    example: '2021-09-01T00:00:00Z',
  })
  @Transform(({ value }) => new Date(value))
  endDate?: Date;
}
