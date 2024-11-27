import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IsAuthenticated } from '../utils/is-authenticated.util';

@Injectable()
export class GraphqlAuthGuard implements CanActivate {
  constructor(private readonly isAuthenticated: IsAuthenticated) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const authHeader = ctx.getContext().req.headers['authorization'];

    try {
      const user = await this.isAuthenticated.verifyBearerToken(authHeader);
      ctx.getContext().req.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
