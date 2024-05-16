import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateExpenseTypeDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'Name of the expense type',
    minLength: 3,
    example: 'Ips',
    type: String,
  })
  name: string;
}
