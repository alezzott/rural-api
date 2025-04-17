import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/farm-create.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('farms')
@Controller('farms')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @ApiResponse({
    status: 200,
    description: 'Lista de fazendas',
    type: [CreateFarmDto],
    schema: {
      example: [
        {
          name: 'Fazenda Primavera',
          city: 'Cidade Exemplo',
          state: 'SP',
          totalArea: 100,
          arableArea: 60,
          vegetationArea: 40,
          producerId: 'uuid-do-produtor',
        },
      ],
    },
  })
  @Get()
  findAll() {
    return this.farmService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Fazenda encontrada',
    type: CreateFarmDto,
    schema: {
      example: {
        name: 'Fazenda Primavera',
        city: 'Cidade Exemplo',
        state: 'SP',
        totalArea: 100,
        arableArea: 60,
        vegetationArea: 40,
        producerId: 'uuid-do-produtor',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmService.findOne(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Fazenda criada com sucesso',
    type: CreateFarmDto,
    schema: {
      example: {
        name: 'Fazenda Primavera',
        city: 'Cidade Exemplo',
        state: 'SP',
        totalArea: 100,
        arableArea: 60,
        vegetationArea: 40,
        producerId: 'uuid-do-produtor',
      },
    },
  })
  @Post()
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.create(createFarmDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Fazenda atualizada',
    type: CreateFarmDto,
    schema: {
      example: {
        name: 'Fazenda Primavera Atualizada',
        city: 'Cidade Exemplo',
        state: 'SP',
        totalArea: 120,
        arableArea: 70,
        vegetationArea: 50,
        producerId: 'uuid-do-produtor',
      },
    },
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateFarmDto: CreateFarmDto) {
    return this.farmService.update(id, updateFarmDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Fazenda removida',
    schema: { example: { message: 'Farm deleted successfully' } },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmService.remove(id);
  }
}
