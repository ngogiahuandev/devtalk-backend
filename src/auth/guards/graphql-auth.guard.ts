import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { extractTokenFromHeader } from './guard.utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const authHeader = ctx.getContext().req.headers['authorization'];

    const token = extractTokenFromHeader(authHeader);
    const user = await this.authService.verifyToken(token);

    ctx.getContext().req.user = user;

    return true;
  }
}
