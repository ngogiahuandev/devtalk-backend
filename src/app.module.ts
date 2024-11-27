import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [GraphqlModule, AuthModule],
})
export class AppModule {}
