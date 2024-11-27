import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/auth/dto/user.dto';

@Injectable()
export class IsAuthenticated {
  constructor(private authService: AuthService) {}

  async verifyBearerToken(authHeader: string): Promise<UserDto> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new GraphQLError('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    const user = await this.authService.verifyToken(token);
    return user;
  }
}
