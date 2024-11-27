import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const authHeader = ctx.getContext().req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new GraphQLError('Missing or invalid Authorization header');
    }
    const token = authHeader.split(' ')[1];
    const user = await this.authService.verifyToken(token);
    ctx.getContext().req.user = user;
    return true;
  }
}
