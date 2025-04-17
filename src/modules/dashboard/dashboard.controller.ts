import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiResponse({
    status: 200,
    description: 'Total de fazendas cadastradas',
    schema: { example: { totalFarms: 42 } },
  })
  @Get('total-farms')
  totalFarms() {
    return this.dashboardService.totalFarms();
  }

  @ApiResponse({
    status: 200,
    description: 'Total de hectares registrados',
    schema: { example: { totalArea: 1234.5 } },
  })
  @Get('total-area')
  totalArea() {
    return this.dashboardService.totalArea();
  }

  @ApiResponse({
    status: 200,
    description: 'Fazendas por estado',
    schema: {
      example: [
        { state: 'SP', count: 10 },
        { state: 'MG', count: 5 },
      ],
    },
  })
  @Get('by-state')
  byState() {
    return this.dashboardService.byState();
  }

  @ApiResponse({
    status: 200,
    description: 'Area plantada',
    schema: {
      example: [
        { crop: 'Soja', count: 8 },
        { crop: 'Milho', count: 4 },
      ],
    },
  })
  @Get('by-crop')
  byCrop() {
    return this.dashboardService.byCrop();
  }

  @ApiResponse({
    status: 200,
    description: 'Uso do solo',
    schema: { example: { arableArea: 800, vegetationArea: 434.5 } },
  })
  @Get('land-use')
  landUse() {
    return this.dashboardService.landUse();
  }
}
