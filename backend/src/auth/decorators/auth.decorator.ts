import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces/validRoles';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { JwtAuthGuard } from '../guards/user-role/jwt-auth.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(UserRoleGuard, JwtAuthGuard),
  );
}
