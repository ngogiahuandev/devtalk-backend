import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { IsAuthenticated } from 'src/auth/utils/is-authenticated.util';

@Module({
  imports: [JwtModule],
  providers: [AuthService, AuthResolver, PrismaService, IsAuthenticated],
})
export class AuthModule {}
