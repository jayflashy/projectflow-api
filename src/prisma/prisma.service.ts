import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { HealthResponse } from 'src/Interfaces/Ihealth.interfaces';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async CheckHealth(): Promise<HealthResponse> {
    const start = performance.now();
    try {
      await this.$queryRaw`SELECT 1;`;
      return {
        service: 'prisma',
        status: 'up',
        message: 'Prisma is up and running',
        duration: Math.round(performance.now() - start),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        service: 'prisma',
        status: 'down',
        message: 'Prisma is down',
        duration: Math.round(performance.now() - start),
      };
    }
  }
}
