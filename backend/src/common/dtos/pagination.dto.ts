import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 10,
    default: 10,
    description: 'The number of items to return',
  })
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    example: 0,
    default: 0,
    description: 'The number of items to skip',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number;
}
