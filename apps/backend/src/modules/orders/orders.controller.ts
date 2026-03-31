import { Controller, Get, Post, Patch, Body, Param, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

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

  // --- 🌟 ดึงคำสั่งซื้อของตัวเอง ---
  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async findMyOrders(@Req() req) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  // --- 🌟 Admin: อัปเดตสถานะคำสั่งซื้อ ---
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    const order = await this.ordersService.updateOrderStatus(id, dto);
    return { success: true, order };
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
