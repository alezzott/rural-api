import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerModule } from './modules/producer/producer.module';
import { FarmModule } from './modules/farm/farm.module';
import { CropModule } from './modules/crops/crop.module';

@Module({
  imports: [ProducerModule, FarmModule, CropModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
