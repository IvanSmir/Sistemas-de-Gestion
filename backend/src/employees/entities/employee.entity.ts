import {
  IsDateString,
  IsEmail,
  IsString,
  Length,
  IsPhoneNumber,
  IsUUID,
} from 'class-validator';

export class Employee {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  image: string;

  @IsString()
  gender: string;

  @IsString()
  direction: string;

  @IsString()
  ruc: string;

  @IsString()
  joinDate: string;

  @IsString()
  birthdate: string;

  @IsPhoneNumber(null) // Acepta un código de país como primer parámetro, `null` permite cualquier formato.
  phone: string;
}
