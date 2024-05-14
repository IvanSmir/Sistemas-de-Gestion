import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsUUID } from 'class-validator';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';

export class CreateEmployeeDto extends CreatePersonDto {
  @IsDate()
  @ApiProperty({
    type: Date,
    description: 'The date when the employee entered the company',
    example: '2021-09-01T00:00:00Z',
  })
  enterDate: Date;
}
