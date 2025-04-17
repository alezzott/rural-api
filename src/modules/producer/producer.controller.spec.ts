import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('ProducerController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const createProducer = async (
    data = { name: 'João', cpfCnpj: '39053344705' },
  ) => prisma.producer.create({ data });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.crop.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.producer.deleteMany();
  });

  it('deve criar um produtor (POST /producers)', async () => {
    const producerData = { name: 'João', cpfCnpj: '39053344705' };

    const response = (await request(app.getHttpServer() as string)
      .post('/producers')
      .send(producerData)
      .expect(201)) as { body: { name: string; cpfCnpj: string; id: string } };

    expect(response.body.name).toBe(producerData.name);
    expect(response.body.cpfCnpj).toBe(producerData.cpfCnpj);
    expect(response.body.id).toBeDefined();

    const producer = await prisma.producer.findUnique({
      where: { cpfCnpj: producerData.cpfCnpj },
    });
    expect(producer).not.toBeNull();
    expect(producer!.name).toBe(producerData.name);
  });

  it('deve atualizar um produtor (PUT /producers/:id)', async () => {
    const producer = await createProducer();

    const updatedData = { name: 'João Atualizado', cpfCnpj: '39053344705' };
    const response = (await request(app.getHttpServer())
      .put(`/producers/${producer.id}`)
      .send(updatedData)
      .expect(200)) as { body: { name: string; cpfCnpj: string; id: string } };

    expect(response.body.name).toBe(updatedData.name);

    const updatedProducer = await prisma.producer.findUnique({
      where: { id: producer.id },
    });
    expect(updatedProducer).not.toBeNull();
    expect(updatedProducer!.name).toBe(updatedData.name);
  });

  it('deve impedir atualização com CPF/CNPJ duplicado (PUT /producers/:id)', async () => {
    await createProducer();
    const producer2 = await createProducer({
      name: 'Maria',
      cpfCnpj: '19131243000197',
    });

    const response = (await request(app.getHttpServer())
      .put(`/producers/${producer2.id}`)
      .send({ cpfCnpj: '39053344705' })
      .expect(400)) as { body: { message: string } };

    expect(response.body.message).toContain('cpf/cnpj already exists');
  });

  it('deve remover um produtor (DELETE /producers/:id)', async () => {
    const producer = await createProducer({
      name: 'Maria',
      cpfCnpj: '19131243000197',
    });

    const response = (await request(app.getHttpServer())
      .delete(`/producers/${producer.id}`)
      .expect(200)) as { body: { message: string } };

    expect(response.body.message).toBe('Producer deleted successfully');

    const deletedProducer = await prisma.producer.findUnique({
      where: { id: producer.id },
    });
    expect(deletedProducer).toBeNull();
  });
});
