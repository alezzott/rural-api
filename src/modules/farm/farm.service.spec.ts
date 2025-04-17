import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from './farm.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import {
  randomProducerName,
  randomCpf,
  randomFarmName,
} from '../../../test/utils/fake-data';

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

    await prisma.crop.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.producer.deleteMany();

    const producer = await prisma.producer.create({
      data: { name: randomProducerName(), cpfCnpj: randomCpf() },
    });
    producerId = producer.id;
  });

  it('deve criar uma fazenda válida', async () => {
    const farmName = randomFarmName();
    const farm = await service.create({
      name: farmName,
      city: 'Cidade',
      state: 'UF',
      totalArea: 10,
      arableArea: 5,
      vegetationArea: 5,
      producerId,
    });
    expect(farm).toHaveProperty('id');
    expect(farm.name).toBe(farmName);
  });

  it('deve lançar erro se farm name já existir', async () => {
    const farmName = randomFarmName();
    await service.create({
      name: farmName,
      city: 'Cidade',
      state: 'UF',
      totalArea: 10,
      arableArea: 5,
      vegetationArea: 5,
      producerId,
    });

    await expect(
      service.create({
        name: farmName,
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
    const farmName = randomFarmName();
    const farm = await service.create({
      name: farmName,
      city: 'Cidade',
      state: 'UF',
      totalArea: 10,
      arableArea: 5,
      vegetationArea: 5,
      producerId,
    });
    const found = await service.findOne(farm.id);
    expect(found).not.toBeNull();
    expect(found.name).toBe(farmName);
  });

  it('deve remover uma fazenda existente', async () => {
    const farmName = randomFarmName();
    const farm = await service.create({
      name: farmName,
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
      data: { name: randomProducerName(), cpfCnpj: randomCpf() },
    });
    const farmName = randomFarmName();
    const farm = await prisma.farm.create({
      data: {
        name: farmName,
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
      data: { name: randomProducerName(), cpfCnpj: randomCpf() },
    });
    const farmName = randomFarmName();
    const farm = await prisma.farm.create({
      data: {
        name: farmName,
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
