import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmDto } from '../farm/dto/farm-create.dto';

@Injectable()
export class FarmService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.farm.findMany();
  }

  async findOne(id: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id } });
    if (!farm) throw new NotFoundException('Farm not found');
    return farm;
  }

  async create(createFarmDto: CreateFarmDto) {
    const producer = await this.prisma.producer.findUnique({
      where: { id: createFarmDto.producerId },
    });
    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    const existingFarm = await this.prisma.farm.findFirst({
      where: { name: createFarmDto.name },
    });
    if (existingFarm) {
      throw new BadRequestException('Farm name already exists');
    }

    return this.prisma.farm.create({ data: createFarmDto });
  }

  async update(id: string, updateFarmDto: CreateFarmDto) {
    await this.findOne(id);
    return this.prisma.farm.update({
      where: { id },
      data: updateFarmDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.farm.delete({ where: { id } });
    return { message: 'Farm deleted successfully' };
  }
}
