import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('total-farms')
  totalFarms() {
    return this.dashboardService.totalFarms();
  }

  @Get('total-area')
  totalArea() {
    return this.dashboardService.totalArea();
  }

  @Get('by-state')
  byState() {
    return this.dashboardService.byState();
  }

  @Get('by-crop')
  byCrop() {
    return this.dashboardService.byCrop();
  }

  @Get('land-use')
  landUse() {
    return this.dashboardService.landUse();
  }
}
