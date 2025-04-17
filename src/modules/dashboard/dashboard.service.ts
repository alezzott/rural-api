import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async totalFarms() {
    const count = await this.prisma.farm.count();
    return { totalFarms: count };
  }

  async totalArea() {
    const result = await this.prisma.farm.aggregate({
      _sum: { totalArea: true },
    });
    return { totalArea: result._sum.totalArea || 0 };
  }

  async byState() {
    const result = await this.prisma.farm.groupBy({
      by: ['state'],
      _count: { id: true },
    });
    return result.map((r) => ({ state: r.state, count: r._count.id }));
  }

  async byCrop() {
    const result = await this.prisma.crop.groupBy({
      by: ['name'],
      _count: { id: true },
    });
    return result.map((r) => ({ crop: r.name, count: r._count.id }));
  }

  async landUse() {
    const result = await this.prisma.farm.aggregate({
      _sum: { arableArea: true, vegetationArea: true },
    });
    return {
      arableArea: result._sum.arableArea || 0,
      vegetationArea: result._sum.vegetationArea || 0,
    };
  }
}
