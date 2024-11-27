import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RefreshInput {
  @Field()
  @IsNotEmpty()
  refreshToken: string;
}

@ObjectType()
export class RefreshToken {
  @Field(() => ID)
  id: string;

  @Field()
  token: string;

  @Field()
  userId: string;

  @Field()
  isRevoked: boolean;

  @Field()
  expiresAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
