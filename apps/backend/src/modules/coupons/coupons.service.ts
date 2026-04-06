import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  // ─── ADMIN CRUD ───
  async findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    code: string;
    discountType: 'FIXED' | 'PERCENTAGE';
    discountValue: number;
    minOrderValue: number;
    maxDiscount?: number;
    expiresAt?: string;
    usageLimit?: number;
  }) {
    const code = data.code.toUpperCase();
    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      throw new BadRequestException('รหัสส่วนลดนี้มีในระบบแล้ว');
    }

    return this.prisma.coupon.create({
      data: {
        code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderValue: data.minOrderValue,
        maxDiscount: data.maxDiscount || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        usageLimit: data.usageLimit || null,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }

  // ─── VALIDATION ───
  async validateCoupon(code: string, cartTotal: number) {
    if (!code) throw new BadRequestException('กรุณาระบุรหัสส่วนลด');

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw new NotFoundException('รหัสส่วนลดไม่ถูกต้อง');
    }

    // 1. Check constraints
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new BadRequestException('รหัสส่วนลดนี้หมดอายุแล้ว');
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('รหัสส่วนลดนี้ถูกใช้ครบตามจำนวนแล้ว');
    }
    if (cartTotal < coupon.minOrderValue) {
      throw new BadRequestException(`รหัสส่วนลดนี้ต้องซื้อขั้นต่ำ ฿${coupon.minOrderValue}`);
    }

    // 2. Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'FIXED') {
      discountAmount = Math.min(coupon.discountValue, cartTotal); // ไม่เกินราคาสินค้า
    } else if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = cartTotal * (coupon.discountValue / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount; // cap the percentage discount
      }
    }

    // prevent negative totals
    discountAmount = Math.max(0, discountAmount);
    discountAmount = Math.min(cartTotal, discountAmount);
    
    return {
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalTotal: cartTotal - discountAmount,
    };
  }
}
