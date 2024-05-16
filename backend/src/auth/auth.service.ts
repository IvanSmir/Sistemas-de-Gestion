import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Users } from '@prisma/client';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    try {
      const { password, confirmPassword, ...userData } = createUserDto;
      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      const user = await this.prismaService.users.create({
        data: {
          ...userData,
          password: bcrypt.hashSync(password, 10),
        },
      });
      const token = this.jwtService.sign({ id: user.id });
      const {
        password: _,
        isActive,
        isDeleted,
        createdAt,
        updatedAt,
        ...userWithoutSensitiveInfo
      } = user;

      return { userWithoutSensitiveInfo, token };
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'User',
        createUserDto.userName,
      );
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, userName } = loginUserDto;
      const user = await this.prismaService.users.findUnique({
        where: { userName: userName, isDeleted: false },
        select: {
          id: true,
          userName: true,
          password: true,
          isActive: true,
          fullName: true,
        },
      });
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      if (!user.isActive)
        throw new BadRequestException('User disabled, contact support');

      if (!bcrypt.compareSync(password, user.password))
        throw new BadRequestException('Invalid credentials');

      const token = this.jwtService.sign({ id: user.id });
      delete user.password;
      delete user.isActive;
      return { ...user, token: token };
    } catch (error) {
      this.handleDbErrorService.handleDbError(
        error,
        'User',
        loginUserDto.userName,
      );
    }
  }
  async logout() {
    try {
      return { message: 'Logged out successfully' };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'User', 'logout');
    }
  }

  async checkAuhtStatus(user: Users) {
    return { ...user, token: this.jwtService.sign({ id: user.id }) };
  }

  // private handleDbError(e: any) {
  //   if (e.code === 'P2002') {
  //     throw new BadRequestException('User with that email already exists');
  //   }
  //   throw new InternalServerErrorException(
  //     'Something went wrong, contact support',
  //   );
  // }
}
