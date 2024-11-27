import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql/graphql.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [GraphqlModule, JwtModule, AuthModule],
})
export class AppModule {}
