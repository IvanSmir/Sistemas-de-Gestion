import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Users } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prismaService: PrismaService,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<Users> {
    const { id } = payload;
    const user = await this.prismaService.users.findUnique({ where: { id } });
    if (!user) throw new UnauthorizedException('Token is invalid');
    if (!user.isActive) throw new UnauthorizedException('Inactive user');
    return user;
  }
}
