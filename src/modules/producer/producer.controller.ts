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

@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get()
  findAll() {
    return this.producerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.producerService.findOne(id);
  }

  @Post()
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producerService.create(createProducerDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ) {
    return this.producerService.update(id, updateProducerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.producerService.remove(id);
    return { message: 'Producer deleted successfully' };
  }
}
