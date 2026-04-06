import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  // ─── PUBLIC ENDPOINT ───
  @Post('validate')
  validateCoupon(@Body() body: { code: string; cartTotal: number }) {
    return this.couponsService.validateCoupon(body.code, body.cartTotal);
  }

  // ─── ADMIN ENDPOINTS ───
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.couponsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() body: any) {
    return this.couponsService.create(body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
