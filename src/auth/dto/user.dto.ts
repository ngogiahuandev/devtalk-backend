import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
  description: 'User roles',
});

@ObjectType()
export class UserDto {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field(() => Role)
  role: Role;

  @Field()
  isBanned: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
