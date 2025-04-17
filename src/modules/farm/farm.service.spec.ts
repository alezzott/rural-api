import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from './farm.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('FarmService', () => {
  let service: FarmService;
  let prisma: PrismaService;
  let producerId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FarmService, PrismaService],
    }).compile();

    service = module.get<FarmService>(FarmService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.farm.deleteMany();
    await prisma.producer.deleteMany();

    const producer = await prisma.producer.create({
      data: { name: 'Produtor', cpfCnpj: '39053344705' },
    });
    producerId = producer.id;
  });

  it('deve criar uma fazenda válida', async () => {
    const farm = await service.create({
      name: 'Fazenda Nova',
      city: 'Cidade',
      state: 'UF',
      totalArea: 10,
      arableArea: 5,
      vegetationArea: 5,
      producerId,
    });
    expect(farm).toHaveProperty('id');
    expect(farm.name).toBe('Fazenda Nova');
  });

  it('deve lançar erro se farm name já existir', async () => {
    await service.create({
      name: 'Fazenda Teste',
      city: 'Cidade',
      state: 'UF',
      totalArea: 10,
      arableArea: 5,
      vegetationArea: 5,
      producerId,
    });

    await expect(
      service.create({
        name: 'Fazenda Teste',
        city: 'Outra Cidade',
        state: 'UF',
        totalArea: 20,
        arableArea: 10,
        vegetationArea: 10,
        producerId,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve lançar erro ao buscar fazenda inexistente', async () => {
    await expect(service.findOne('id-invalido')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve buscar uma fazenda existente', async () => {
    const farm = await service.create({
      name: 'Fazenda Busca',
      city: 'Cidade',
      state: 'UF',
      totalArea: 10,
      arableArea: 5,
      vegetationArea: 5,
      producerId,
    });
    const found = await service.findOne(farm.id);
    expect(found).not.toBeNull();
    expect(found.name).toBe('Fazenda Busca');
  });

  it('deve remover uma fazenda existente', async () => {
    const farm = await service.create({
      name: 'Fazenda Remover',
      city: 'Cidade',
      state: 'UF',
      totalArea: 10,
      arableArea: 5,
      vegetationArea: 5,
      producerId,
    });
    const result = await service.remove(farm.id);
    expect(result).toHaveProperty('message', 'Farm deleted successfully');
    await expect(service.findOne(farm.id)).rejects.toThrow(NotFoundException);
  });

  it('deve permitir criar uma fazenda sem culturas', async () => {
    const producer = await prisma.producer.create({
      data: { name: 'Produtor', cpfCnpj: String(Date.now()) },
    });
    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Sem area',
        city: 'Cidade',
        state: 'UF',
        totalArea: 10,
        arableArea: 5,
        vegetationArea: 5,
        producerId: producer.id,
      },
    });
    const crops = await prisma.crop.findMany({ where: { farmId: farm.id } });
    expect(crops.length).toBe(0);
  });

  it('deve permitir criar uma fazenda com várias culturas', async () => {
    const producer = await prisma.producer.create({
      data: { name: 'Produtor', cpfCnpj: String(Date.now()) },
    });
    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Multi area',
        city: 'Cidade',
        state: 'UF',
        totalArea: 10,
        arableArea: 5,
        vegetationArea: 5,
        producerId: producer.id,
      },
    });
    await prisma.crop.createMany({
      data: [
        { name: 'Soja', season: '2024/2025', farmId: farm.id },
        { name: 'Milho', season: '2024/2025', farmId: farm.id },
      ],
    });
    const crops = await prisma.crop.findMany({ where: { farmId: farm.id } });
    expect(crops.length).toBe(2);
  });
});
