import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Global()
@Module({
  imports: [
    NestJwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN },
    }),
  ],
  providers: [JwtService, JwtStrategy, JwtAuthGuard],
  exports: [JwtService, JwtAuthGuard],
})
export class JwtModule {}
