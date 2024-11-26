import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HealthResponse } from 'src/Interfaces/Ihealth.interfaces';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthResponse> {
    return this.prisma.CheckHealth();
  }
}
