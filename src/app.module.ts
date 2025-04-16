import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerModule } from './modules/producer/producer.module';

@Module({
  imports: [ProducerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
