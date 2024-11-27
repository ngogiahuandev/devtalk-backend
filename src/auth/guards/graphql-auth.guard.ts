import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IsAuthenticated } from '../utils/is-authenticated.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly isAuthenticated: IsAuthenticated) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const authHeader = ctx.getContext().req.headers['authorization'];
    const user = await this.isAuthenticated.verifyBearerToken(authHeader);
    ctx.getContext().req.user = user;
    return true;
  }
}
