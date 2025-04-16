import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { PrismaService } from '../prisma/prisma.service';
import { CpfCnpjValidator } from '../../common/validators/cnpj-cpf-validator';
import { ProducerController } from './producer.controller';

@Module({
  controllers: [ProducerController],
  providers: [ProducerService, PrismaService, CpfCnpjValidator],
})
export class ProducerModule {}
