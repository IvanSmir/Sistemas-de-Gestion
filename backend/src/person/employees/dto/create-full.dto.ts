import { ApiProperty } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class FamilyMember extends CreatePersonDto {
  @IsUUID()
  @ApiProperty({
    description: 'The family type id of the family member',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  familyTypeId: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the person is new on the system',
    example: true,
  })
  isNew: boolean;
}

enum SalaryType {
  MINIMUM = 'minimum',
  BASE = 'base',
}

class Role {
  @IsUUID()
  @ApiProperty({
    description: 'The position of the employee',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  positionId: string;

  @IsNumber()
  @ApiProperty({
    description: 'The amount of the salary of the employee',
    example: 100,
  })
  @IsOptional()
  amount?: number;

  @IsEnum(SalaryType)
  @ApiProperty({
    description: 'The type of the salary of the employee',
    example: SalaryType.BASE,
    enum: SalaryType,
  })
  salaryType: SalaryType;
}
export class CreateFullDto {
  @ApiProperty({
    description: 'The employee details',
    type: CreateEmployeeDto,
  })
  @ValidateNested()
  @Type(() => CreateEmployeeDto)
  employee: CreateEmployeeDto;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the person is new on the system',
    example: true,
  })
  isNew: boolean;

  @ApiProperty({
    description: 'The role details',
    type: Role,
  })
  @ValidateNested()
  @Type(() => Role)
  role: Role;

  @ApiProperty({
    description: 'The list of family members',
    type: [FamilyMember],
  })
  @ValidateNested({ each: true })
  @Type(() => FamilyMember)
  familyMembers: FamilyMember[];
}
