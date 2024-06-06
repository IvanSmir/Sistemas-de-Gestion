import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateBasicConfigDto {
  @ApiProperty({
    description: 'Nombre de la configuración',
    example: 'Salario mínimo',
    type: String,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Valor de la configuración',
    example: 100,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  value: number;
}
