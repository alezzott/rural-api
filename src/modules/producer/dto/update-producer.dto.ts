import { PartialType } from '@nestjs/mapped-types';
import { CreateProducerDto } from './create-producer.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProducerDto extends PartialType(CreateProducerDto) {
  @ApiProperty({ example: 'João Atualizado', required: false })
  name?: string;

  @ApiProperty({ example: '39053344705', required: false })
  cpfCnpj?: string;
}
