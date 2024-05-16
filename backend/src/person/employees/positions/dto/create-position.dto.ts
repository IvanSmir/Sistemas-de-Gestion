import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    example: 'Software Engineer',
    description: 'Name of the position',
  })
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    example: 'IT area manager in the company',
    description: 'Description of the position',
    minLength: 3,
    maxLength: 100,
  })
  description: string;
}
