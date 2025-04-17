import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCropDto } from './dto/create-crop.dto';

@Injectable()
export class CropService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const crop = await this.prisma.crop.findUnique({ where: { id } });
    if (!crop) throw new NotFoundException('Crop not found');
    return crop;
  }

  async findAll() {
    return this.prisma.crop.findMany();
  }

  async create(createCropDto: CreateCropDto) {
    const farm = await this.prisma.farm.findUnique({
      where: { id: createCropDto.farmId },
    });
    if (!farm) throw new NotFoundException('Farm not found');

    const existingCrop = await this.prisma.crop.findFirst({
      where: { name: createCropDto.name, farmId: createCropDto.farmId },
    });
    if (existingCrop)
      throw new BadRequestException('Crop already exists for this farm');

    return this.prisma.crop.create({ data: createCropDto });
  }

  async update(id: string, updateCropDto: CreateCropDto) {
    await this.findOne(id);
    return this.prisma.crop.update({
      where: { id },
      data: updateCropDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.crop.delete({ where: { id } });
    return { message: 'Crop deleted successfully' };
  }
}
