import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql/graphql.module';
import { PrismaService } from './prisma/prisma.service';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [GraphqlModule, HelloModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
