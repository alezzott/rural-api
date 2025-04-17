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

    await prisma.crop.deleteMany();
    await prisma.farm.deleteMany();
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

  it('deve permitir criar um produtor sem fazendas', async () => {
    const producer = await prisma.producer.create({
      data: { name: 'Produtor Sem Fazenda', cpfCnpj: String(Date.now()) },
    });
    const farms = await prisma.farm.findMany({
      where: { producerId: producer.id },
    });
    expect(farms.length).toBe(0);
  });

  it('deve permitir criar um produtor com várias fazendas', async () => {
    const producer = await prisma.producer.create({
      data: { name: 'Produtor Multi', cpfCnpj: String(Date.now()) },
    });
    await prisma.farm.createMany({
      data: [
        {
          name: 'Fazenda 1',
          city: 'Cidade',
          state: 'UF',
          totalArea: 10,
          arableArea: 5,
          vegetationArea: 5,
          producerId: producer.id,
        },
        {
          name: 'Fazenda 2',
          city: 'Cidade',
          state: 'UF',
          totalArea: 20,
          arableArea: 10,
          vegetationArea: 10,
          producerId: producer.id,
        },
      ],
    });
    const farms = await prisma.farm.findMany({
      where: { producerId: producer.id },
    });
    expect(farms.length).toBe(2);
  });
});
