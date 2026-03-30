import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Post('checkout')
  async checkout(@Body() body: any) {
    try {
      const order = await this.ordersService.createCheckout(body);
      return { success: true, orderId: order.id };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
}
