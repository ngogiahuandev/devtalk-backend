import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { LoginInput, LoginResponse } from 'src/auth/dto/login.dto';
import { RegisterInput } from 'src/auth/dto/register.dto';
import { UserDto } from 'src/auth/dto/user.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String, { name: 'hello' })
  async hello() {
    return 'Hello World!';
  }

  @Mutation(() => LoginResponse, { name: 'login' })
  async login(@Args('payload') payload: LoginInput) {
    return this.authService.login(payload);
  }

  @Mutation(() => UserDto, { name: 'register' })
  async register(@Args('payload') payload: RegisterInput) {
    return this.authService.register(payload);
  }
}
