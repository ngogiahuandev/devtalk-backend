import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { UserDto } from 'src/auth/dto/user.dto';

@Injectable()
export class IsAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user as UserDto;

    if (user.role !== 'ADMIN') {
      throw new GraphQLError('Access denied');
    }

    return true;
  }
}
