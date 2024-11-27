import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { extractTokenFromHeader } from './guard.utils';
import { GraphQLError } from 'graphql';

@Injectable()
export class RefreshTokenAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const authHeader = ctx.getContext().req.headers['authorization'];

    const token = extractTokenFromHeader(authHeader);
    const payload = this.jwtService.decode(token) as any;

    if (!payload || !payload.sub) {
      throw new GraphQLError('Invalid refresh token');
    }

    const user = await this.authService.verifyUser(payload.sub);

    ctx.getContext().req.user = user;

    return true;
  }
}
