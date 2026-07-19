import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { databaseProviders } from './database.provider';

@Global()
@Module({
  providers: [...databaseProviders, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
