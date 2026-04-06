import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersCronService } from './orders.cron.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersCronService],
})
export class OrdersModule {}
