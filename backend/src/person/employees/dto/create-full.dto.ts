import { ApiProperty } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';

class familyMember extends CreatePersonDto {
  familyTypeId: string;
}

class role {
  positionId: string;
  amount: number;
  incomeTypeId: string;
}

export class createFullDto {
  @ApiProperty()
  employee: CreateEmployeeDto;
  role: role;
  familyMembers: familyMember[];
}
