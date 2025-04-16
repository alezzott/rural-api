import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProducerService', () => {
  let service: ProducerService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProducerService, PrismaService],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.producer.deleteMany();
  });

  it('deve lançar erro ao criar produtor com nome vazio', async () => {
    await expect(
      service.create({ name: '', cpfCnpj: '39053344705' }),
    ).rejects.toThrow();
  });

  it('deve lançar erro ao atualizar produtor com nome vazio', async () => {
    const created = await service.create({
      name: 'João',
      cpfCnpj: '39053344705',
    });
    await expect(service.update(created.id, { name: '' })).rejects.toThrow();
  });
});
