import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Injectable()
export class ProducerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.producer.findMany();
  }

  async findOne(id: string) {
    const producer = await this.prisma.producer.findUnique({ where: { id } });

    if (!producer) {
      throw new NotFoundException(`producer with id ${id} not found`);
    }

    return producer;
  }

  async create(createProducerDto: CreateProducerDto) {
    const { cpfCnpj } = createProducerDto;

    const existingProducer = await this.prisma.producer.findUnique({
      where: { cpfCnpj },
    });

    if (!createProducerDto.name || createProducerDto.name.trim() === '') {
      throw new Error('Nome não pode ser vazio');
    }

    if (existingProducer) {
      throw new BadRequestException('cpf/cnpj already exists');
    }

    return this.prisma.producer.create({ data: createProducerDto });
  }

  async update(id: string, updateProducerDto: UpdateProducerDto) {
    const producer = await this.findOne(id);

    if (
      updateProducerDto.name !== undefined &&
      updateProducerDto.name.trim() === ''
    ) {
      throw new BadRequestException('Nome não pode ser vazio');
    }

    if (updateProducerDto.cpfCnpj) {
      const exists = await this.prisma.producer.findFirst({
        where: {
          cpfCnpj: updateProducerDto.cpfCnpj,
          NOT: { id: producer.id },
        },
      });

      if (exists) {
        console.log('CPF/CNPJ duplicado detectado');
        throw new BadRequestException('cpf/cnpj already exists');
      }
    }

    return this.prisma.producer.update({
      where: { id: producer.id },
      data: updateProducerDto,
    });
  }

  async remove(id: string) {
    const producer = await this.findOne(id);

    return this.prisma.producer.delete({ where: { id: producer.id } });
  }
}
