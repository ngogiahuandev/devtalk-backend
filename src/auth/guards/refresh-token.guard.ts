import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RefreshTokenAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const authHeader = ctx.getContext().req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new GraphQLError('Missing or invalid Authorization header');
    }
    const token = authHeader.split(' ')[1];
    const payload = this.jwtService.decode(token) as any;
    const user = await this.authService.verifyUser(payload.sub);
    ctx.getContext().req.user = user;
    return true;
  }
}
