import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from 'src/auth/jwt/jwt.module';

@Module({
  imports: [GraphqlModule, AuthModule, JwtModule],
})
export class AppModule {}
