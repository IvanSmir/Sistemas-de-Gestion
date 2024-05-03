// src/cargos/dto/create-cargo.dto.ts
import { Cargo } from '../entities/cargo.entity';
import { OmitType } from '@nestjs/mapped-types';

export class CreateCargoDto extends OmitType(Cargo, ['id'] as const) {}
