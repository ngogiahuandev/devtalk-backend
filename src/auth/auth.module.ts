import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/auth/guards/graphql-auth.guard';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule],
  providers: [
    AuthService,
    AuthResolver,
    PrismaService,
    AuthGuard,
    IsAdminGuard,
  ],
})
export class AuthModule {}
