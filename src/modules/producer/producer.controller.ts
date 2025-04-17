import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('producers')
@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @ApiResponse({
    status: 200,
    description: 'Lista de produtores',
    type: [CreateProducerDto],
    schema: {
      example: [
        { name: 'João da Silva', cpfCnpj: '39053344705' },
        { name: 'Maria Souza', cpfCnpj: '12345678901' },
      ],
    },
  })
  @Get()
  findAll() {
    return this.producerService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Produtor encontrado',
    type: CreateProducerDto,
    schema: {
      example: { name: 'João da Silva', cpfCnpj: '39053344705' },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.producerService.findOne(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Produtor criado com sucesso',
    type: CreateProducerDto,
    schema: {
      example: { name: 'João da Silva', cpfCnpj: '39053344705' },
    },
  })
  @Post()
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producerService.create(createProducerDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Produtor atualizado',
    type: CreateProducerDto,
    schema: {
      example: { name: 'João Atualizado', cpfCnpj: '39053344705' },
    },
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ) {
    return this.producerService.update(id, updateProducerDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Produtor removido',
    schema: { example: { message: 'Producer deleted successfully' } },
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.producerService.remove(id);
    return { message: 'Producer deleted successfully' };
  }
}
