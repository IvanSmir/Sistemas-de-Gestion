import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateExpenseTypeDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    description: 'Name of the expense type',
    minLength: 3,
    maxLength: 50,
    example: 'Ips',
    type: String,
  })
  name: string;
}
