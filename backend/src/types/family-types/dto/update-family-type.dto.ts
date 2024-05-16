import { PartialType } from '@nestjs/swagger';
import { CreateFamilyTypeDto } from './create-family-type.dto';

export class UpdateFamilyTypeDto extends PartialType(CreateFamilyTypeDto) {}
