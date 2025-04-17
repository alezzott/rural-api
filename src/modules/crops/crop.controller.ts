import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CropService } from './crop.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('crops')
@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @ApiResponse({
    status: 200,
    description: 'Lista de culturas',
    type: [CreateCropDto],
    schema: {
      example: [
        { name: 'Soja', season: '2024/2025', farmId: 'uuid-da-fazenda' },
        { name: 'Milho', season: '2024/2025', farmId: 'uuid-da-fazenda' },
      ],
    },
  })
  @Get()
  findAll() {
    return this.cropService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Cultura encontrada',
    type: CreateCropDto,
    schema: {
      example: { name: 'Soja', season: '2024/2025', farmId: 'uuid-da-fazenda' },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cropService.findOne(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Cultura criada com sucesso',
    type: CreateCropDto,
    schema: {
      example: { name: 'Soja', season: '2024/2025', farmId: 'uuid-da-fazenda' },
    },
  })
  @Post()
  create(@Body() createCropDto: CreateCropDto) {
    return this.cropService.create(createCropDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Cultura atualizada',
    type: CreateCropDto,
    schema: {
      example: {
        name: 'Milho',
        season: '2024/2025',
        farmId: 'uuid-da-fazenda',
      },
    },
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCropDto: CreateCropDto) {
    return this.cropService.update(id, updateCropDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Cultura removida',
    schema: { example: { message: 'Crop deleted successfully' } },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cropService.remove(id);
  }
}
