import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('HealthService', () => {
  let service: HealthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: {
            CheckHealth: jest.fn().mockResolvedValue({
              service: 'prisma',
              status: 'up',
              message: 'Mocked Prisma working',
              duration: 10,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return health status from prisma', async () => {
    const spy = jest.spyOn(prismaService, 'CheckHealth');

    const result = await service.check();

    expect(result.status).toBe('up');
    expect(result.message).toBe('Mocked Prisma working');
    expect(spy).toHaveBeenCalled();
  });
});
