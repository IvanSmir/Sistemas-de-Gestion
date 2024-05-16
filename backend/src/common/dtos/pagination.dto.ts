import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

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
  @Type(() => Number)
  @Transform(({ value }) => value ?? 10)
  limit?: number;

  @ApiProperty({
    example: 1,
    default: 1,
    description: 'The number of items to skip',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @Transform(({ value }) => value ?? 1)
  page?: number;
}
