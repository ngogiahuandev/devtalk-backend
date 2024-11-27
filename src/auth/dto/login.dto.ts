import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { UserDto } from 'src/auth/dto/user.dto';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => UserDto)
  user: UserDto;
}
