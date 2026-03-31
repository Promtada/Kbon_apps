import { Controller, Get, Post, Body, Param, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  // --- 🌟 Checkout: ต้อง Login ก่อนถึงจะสั่งซื้อได้ ---
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@Req() req, @Body() dto: CreateCheckoutDto) {
    const order = await this.ordersService.createCheckout(req.user.id, dto);
    return { success: true, orderId: order.id };
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
