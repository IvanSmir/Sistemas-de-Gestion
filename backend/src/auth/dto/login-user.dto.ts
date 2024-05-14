import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @MinLength(5)
  @Matches(/^[a-zA-Z_]+$/, {
    message: 'Username must be a string with no spaces and special characters',
  })
  @ApiProperty({ example: 'john_doe', description: 'Username for the user' })
  userName: string;

  @IsString()
  @MinLength(5)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
  })
  @ApiProperty({ example: 'P@ssw0rd', description: 'Password for the user' })
  password: string;
}
