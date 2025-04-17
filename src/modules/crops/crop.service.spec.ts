import { Test, TestingModule } from '@nestjs/testing';
import { CropService } from './crop.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CropService', () => {
  let service: CropService;
  let prisma: PrismaService;
  let farmId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CropService, PrismaService],
    }).compile();

    service = module.get<CropService>(CropService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.crop.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.producer.deleteMany();

    const producer = await prisma.producer.create({
      data: { name: 'Produtor', cpfCnpj: String(Date.now()) },
    });
    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Teste 5',
        city: 'Cidade',
        state: 'UF',
        totalArea: 100,
        arableArea: 60,
        vegetationArea: 40,
        producerId: producer.id,
      },
    });
    farmId = farm.id;
  });

  it('deve criar uma cultura válida', async () => {
    const crop = await service.create({
      name: 'Soja',
      season: '2024/2025',
      farmId,
    });
    expect(crop).toHaveProperty('id');
    expect(crop.name).toBe('Soja');
  });

  it('deve lançar erro se farmId não existir', async () => {
    await expect(
      service.create({
        name: 'Milho',
        season: '2024/2025',
        farmId: 'id-invalido',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve lançar erro se já existir cultura com mesmo nome na fazenda', async () => {
    await service.create({
      name: 'Soja',
      season: '2024/2025',
      farmId,
    });

    await expect(
      service.create({
        name: 'Soja',
        season: '2025/2026',
        farmId,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve buscar uma cultura existente', async () => {
    const crop = await service.create({
      name: 'Milho',
      season: '2024/2025',
      farmId,
    });
    const found = await service.findOne(crop.id);
    expect(found.name).toBe('Milho');
  });

  it('deve lançar erro ao buscar cultura inexistente', async () => {
    await expect(service.findOne('id-invalido')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve remover uma cultura existente', async () => {
    const producer = await prisma.producer.create({
      data: { name: 'Produtor', cpfCnpj: String(Date.now()) },
    });

    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Remover Cultura',
        city: 'Cidade',
        state: 'UF',
        totalArea: 10,
        arableArea: 5,
        vegetationArea: 5,
        producerId: producer.id,
      },
    });

    const crop = await service.create({
      name: 'Feijão',
      season: '2024/2025',
      farmId: farm.id,
    });

    const result = await service.remove(crop.id);
    expect(result).toHaveProperty('message', 'Crop deleted successfully');
    await expect(service.findOne(crop.id)).rejects.toThrow(NotFoundException);
  });
});
