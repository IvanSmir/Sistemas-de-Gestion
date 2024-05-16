import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateExpenseDto {
  @IsUUID()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The employee ID',
  })
  employeeId: string;

  @IsUUID()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The income type ID',
  })
  expenseTypeId: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    example: 100,
    description: 'The amount of the income',
    minimum: 1,
  })
  amount: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    example: '2021-09-01T00:00:00Z',
    description: 'The date of the income',
  })
  date: Date;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Whether the income is active',
  })
  active: boolean;
}
