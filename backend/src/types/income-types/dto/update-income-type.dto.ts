import { PartialType } from '@nestjs/swagger';
import { CreateIncomeTypeDto } from './create-income-type.dto';

export class UpdateIncomeTypeDto extends PartialType(CreateIncomeTypeDto) {}
