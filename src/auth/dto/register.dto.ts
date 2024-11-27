import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';
import { UserDto } from 'src/auth/dto/user.dto';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(3)
  username: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field()
  @MinLength(6)
  confirmPassword: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  user: UserDto;
}
