import { PartialType } from '@nestjs/swagger';
import { CreateBasicConfigDto } from './create-basic-config.dto';

export class UpdateBasicConfigDto extends PartialType(CreateBasicConfigDto) {}
