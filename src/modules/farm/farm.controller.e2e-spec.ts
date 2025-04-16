import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('FarmController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let producerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    await app.init();

    await prisma.farm.deleteMany();
    await prisma.producer.deleteMany();

    const producer = await prisma.producer.create({
      data: { name: 'Produtor', cpfCnpj: '39053344705' },
    });
    producerId = producer.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('deve criar uma fazenda (POST /farms)', async () => {
    const farmData = {
      name: 'Fazenda Integração',
      city: 'Cidade',
      state: 'UF',
      totalArea: 100,
      arableArea: 60,
      vegetationArea: 40,
      producerId,
    };

    const response = (await request(app.getHttpServer() as string)
      .post('/farms')
      .send(farmData)
      .expect(201)) as { body: { name: string; producerId: string } };

    expect(response.body.name).toBe(farmData.name);
    expect(response.body.producerId).toBe(producerId);
  });

  it('deve impedir criação com producerId inválido', async () => {
    const farmData = {
      name: 'Fazenda Inválida',
      city: 'Cidade',
      state: 'UF',
      totalArea: 100,
      arableArea: 60,
      vegetationArea: 40,
      producerId: 'id-invalido',
    };

    const response = await request(app.getHttpServer() as string)
      .post('/farms')
      .send(farmData)
      .expect(404);

    expect((response.body as { message: string }).message).toBe(
      'Producer not found',
    );
  });

  it('deve impedir criação com nome duplicado', async () => {
    const farmData = {
      name: 'Fazenda Integração',
      city: 'Cidade',
      state: 'UF',
      totalArea: 100,
      arableArea: 60,
      vegetationArea: 40,
      producerId,
    };

    await request(app.getHttpServer() as string)
      .post('/farms')
      .send(farmData)
      .expect(201);

    const response = await request(app.getHttpServer() as string)
      .post('/farms')
      .send(farmData)
      .expect(400);

    expect((response.body as { message: string }).message).toBe(
      'Farm name already exists',
    );
  });

  it('deve buscar uma fazenda existente (GET /farms/:id)', async () => {
    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Busca',
        city: 'Cidade',
        state: 'UF',
        totalArea: 10,
        arableArea: 5,
        vegetationArea: 5,
        producerId,
      },
    });

    const response = (await request(app.getHttpServer() as string)
      .get(`/farms/${farm.id}`)
      .expect(200)) as { body: { name: string } };

    expect(response.body.name).toBe('Fazenda Busca');
  });

  it('deve remover uma fazenda (DELETE /farms/:id)', async () => {
    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Remover',
        city: 'Cidade',
        state: 'UF',
        totalArea: 10,
        arableArea: 5,
        vegetationArea: 5,
        producerId,
      },
    });

    const response = await request(app.getHttpServer() as string)
      .delete(`/farms/${farm.id}`)
      .expect(200);

    expect((response.body as { message: string }).message).toBe(
      'Farm deleted successfully',
    );
  });
});
