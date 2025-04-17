import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmDto } from '../farm/dto/farm-create.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

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
    const { totalArea, arableArea, vegetationArea } = createFarmDto;

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

    if ((arableArea ?? 0) + (vegetationArea ?? 0) > (totalArea ?? 0)) {
      throw new BadRequestException(
        'A soma das áreas agricultável e de vegetação não pode ultrapassar a área total da fazenda',
      );
    }

    return this.prisma.farm.create({ data: createFarmDto });
  }

  async update(id: string, updateFarmDto: UpdateFarmDto) {
    const farm = await this.findOne(id);

    const totalArea = updateFarmDto.totalArea ?? farm.totalArea;
    const arableArea = updateFarmDto.arableArea ?? farm.arableArea;
    const vegetationArea = updateFarmDto.vegetationArea ?? farm.vegetationArea;

    if ((arableArea ?? 0) + (vegetationArea ?? 0) > (totalArea ?? 0)) {
      throw new BadRequestException(
        'A soma das áreas agricultável e de vegetação não pode ultrapassar a área total da fazenda',
      );
    }

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
