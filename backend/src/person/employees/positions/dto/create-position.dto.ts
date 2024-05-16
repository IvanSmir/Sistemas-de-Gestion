import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @ApiProperty({
    example: 'Software Engineer',
    description: 'Name of the position',
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'IT area manager in the company',
    description: 'Description of the position',
  })
  description: string;
}
