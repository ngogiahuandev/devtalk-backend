import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { LoginInput, AuthResponse } from 'src/auth/dto/login.dto';
import { RegisterInput } from 'src/auth/dto/register.dto';
import { UserDto } from 'src/auth/dto/user.dto';
import { AuthGuard } from 'src/auth/guards/graphql-auth.guard';
import { RefreshTokenAuthGuard } from 'src/auth/guards/refresh-token.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String, { name: 'hello' })
  async hello() {
    return 'Hello World!';
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  async login(@Args('payload') payload: LoginInput) {
    return this.authService.login(payload);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UserDto, { name: 'register' })
  async register(@Args('payload') payload: RegisterInput) {
    return this.authService.register(payload);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Mutation(() => AuthResponse, { name: 'refreshTokens' })
  async refreshTokens(
    @Args('refreshToken') refreshToken: string,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.authService.refreshTokens(refreshToken, user);
  }
}
