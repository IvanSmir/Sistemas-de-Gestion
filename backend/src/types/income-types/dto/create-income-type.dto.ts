import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreateIncomeTypeDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'Name of the income type',
    minLength: 3,
    example: 'Sueldo Minimo',
    type: String,
  })
  name: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Is the income type ips deductible',
    example: true,
    type: Boolean,
  })
  deductible: boolean;
}
