import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { IsCedulaOrRUC } from '../decorators/is-ci-ruc.decorator';
import { Transform } from 'class-transformer';

export class CreatePersonDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    example: 'Juan',
    description: 'Name of the person',
  })
  name: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({
    example: 'Av. 10 de Agosto',
    description: 'Address of the person',
  })
  address: string;

  @IsPhoneNumber()
  @ApiProperty({
    example: '+595971123123',
    description: 'Phone number of the person',
  })
  phone: string;

  @IsEmail()
  @ApiProperty({
    example: 'juan@mail.com',
    description: 'Email of the person',
  })
  email: string;

  @IsString()
  @IsCedulaOrRUC()
  @ApiProperty({
    example: '1234567-8',
    description: 'Cedula or RUC of the person',
  })
  ciRuc: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    example: '2021-09-01T00:00:00Z',
    description: 'Birthdate of the person',
  })
  birthDate: Date;

  @IsString()
  @IsIn(['male', 'female'], {
    message: 'gender must be either "male" or "female"',
  })
  @ApiProperty({
    example: 'male',
    description:
      'The gender of the person, allowed values: "male" or "female".',
  })
  gender: string;
}
