import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService, private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Falta token');
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET || 'iris-crm-secret' });
      req.user = payload;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, ctx.getHandler());
    if (requiredRoles && !requiredRoles.includes(req.user.role)) {
      throw new UnauthorizedException('Tu rol no tiene acceso a este recurso');
    }
    return true;
  }
}
