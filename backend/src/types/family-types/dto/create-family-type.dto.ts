import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFamilyTypeDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the family type',
    example: 'Son',
  })
  name: string;
}
