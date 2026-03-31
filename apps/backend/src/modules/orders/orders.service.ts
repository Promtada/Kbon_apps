import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                mainImageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                mainImageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  // --- 🌟 ดึงคำสั่งซื้อของผู้ใช้ที่ล็อกอินอยู่ ---
  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                mainImageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- 🌟 Admin: อัปเดตสถานะคำสั่งซื้อ ---
  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    const existing = await this.prisma.order.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`ไม่พบคำสั่งซื้อ ${id}`);
    }

    const updateData: any = {};
    if (dto.status) updateData.status = dto.status;
    if (dto.paymentStatus) updateData.paymentStatus = dto.paymentStatus;
    if (dto.trackingNumber !== undefined) updateData.trackingNumber = dto.trackingNumber;

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                mainImageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  // --- 🌟 Checkout ที่ปลอดภัย: ใช้ userId จาก JWT ---
  async createCheckout(userId: string, dto: CreateCheckoutDto) {
    // 1. ตรวจสอบสินค้าทุกชิ้น (stock + existence)
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('มีสินค้าบางรายการไม่พบในระบบ');
    }

    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new BadRequestException(`ไม่พบสินค้า ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `สินค้า "${product.name}" คงเหลือไม่เพียงพอ (เหลือ ${product.stock} ชิ้น)`,
        );
      }
    }

    // 2. คำนวณยอดรวม (ใช้ราคาจากฝั่ง server เพื่อป้องกันการแก้ไขราคา)
    const totalAmount = dto.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    // 3. ทำทุกอย่างใน Transaction เพื่อความปลอดภัย
    return this.prisma.$transaction(async (tx) => {
      // 3a. สร้าง Address
      const address = await tx.address.create({
        data: {
          userId,
          fullName: dto.fullName,
          phone: dto.phone,
          addressLine: dto.addressLine,
          province: dto.province,
          postalCode: dto.postalCode,
        },
      });

      // 3b. สร้าง Order + OrderItems
      const order = await tx.order.create({
        data: {
          userId,
          addressId: address.id,
          shippingAddressSnapshot: JSON.stringify({
            fullName: dto.fullName,
            phone: dto.phone,
            addressLine: dto.addressLine,
            province: dto.province,
            postalCode: dto.postalCode,
          }),
          totalAmount,
          paymentMethod: dto.paymentMethod,
          paymentStatus: 'UNPAID',
          status: 'PENDING',
          items: {
            create: dto.items.map((item) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: product.price,
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });

      // 3c. ลด Stock สินค้า
      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return order;
    });
  }
}
