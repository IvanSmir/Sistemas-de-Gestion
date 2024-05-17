import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsUUID } from 'class-validator';

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

  @IsDate()
  @ApiProperty({
    type: Date,
    description: 'The end date of the position',
    example: '2021-09-01T00:00:00Z',
  })
  @Transform(({ value }) => new Date(value))
  endDate?: Date;
}
