import { Module } from '@nestjs/common';
import { CropService } from './crop.service';
import { CropController } from './crop.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CropController],
  providers: [CropService, PrismaService],
})
export class CropModule {}
