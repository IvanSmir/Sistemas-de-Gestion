import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Full name must be a string',
  })
  @MinLength(3)
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  fullName: string;

  @IsString()
  @MinLength(5)
  @Matches(/^[a-zA-Z_]+$/, {
    message: 'username must be a string with no spaces and special characters',
  })
  @ApiProperty({ example: 'john_doe', description: 'Username for the user' })
  userName: string;

  @IsString()
  @MinLength(5)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
  })
  @ApiProperty({
    example: 'strongpassword',
    description: 'Password for the user',
  })
  password: string;

  @IsString()
  @MinLength(5)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
  })
  @ApiProperty({
    example: 'strongpassword',
    description: 'Password for the user',
  })
  confirmPassword: string;
}
