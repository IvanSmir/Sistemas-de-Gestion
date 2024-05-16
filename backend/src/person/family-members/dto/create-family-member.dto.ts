import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';

export class CreateFamilyMemberDto extends CreatePersonDto {
  @IsUUID()
  @ApiProperty({
    description: 'The family type id of the family member',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  familyTypeId: string;

  @IsUUID()
  @ApiProperty({
    description: 'The employee id of the family member',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  employeeId: string;
}
