import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeDetailDto } from './create-employee-detail.dto';

export class UpdateEmployeeDetailDto extends PartialType(CreateEmployeeDetailDto) {}
