import { Controller, Post, Body, UseInterceptors, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtCookieInterceptorInterceptor } from './interceptors/jwt-cookie.interceptor';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { Users } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateUserDto })
  @Post('signup')
  @UseInterceptors(JwtCookieInterceptorInterceptor)
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @UseInterceptors(JwtCookieInterceptorInterceptor)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid Credentials' })
  @ApiBody({ type: LoginUserDto })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  @UseInterceptors(JwtCookieInterceptorInterceptor)
  logout() {
    return this.authService.logout();
  }

  @Get('check-auth')
  @UseInterceptors(JwtCookieInterceptorInterceptor)
  @Auth()
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({
    status: 200,
    description: 'Authentication status verified.',
    type: () => ({
      ok: Boolean,
      message: String,
      user: LoginUserDto,
    }),
  })
  checkAuth(@GetUser() user: Users) {
    return this.authService.checkAuhtStatus(user);
  }

  @Get('test3')
  @Auth()
  @ApiOperation({ summary: 'Test authentication module' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Auth module is working.',
    type: () => ({
      ok: Boolean,
      message: String,
      user: LoginUserDto,
    }),
  })
  test3(@GetUser() user: Users) {
    return {
      ok: true,
      message: 'Auth module is working',
      user: user,
    };
  }
}
