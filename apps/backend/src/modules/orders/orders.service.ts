import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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

  async createCheckout(data: any) {
    // Simulate finding a logged-in user
    const firstUser = await this.prisma.user.findFirst();
    if (!firstUser) {
      throw new Error('No user found for simulation');
    }

    // Attempt to grab an address or use a fallback UUID to satisfy relation
    const userAddress = await this.prisma.address.findFirst({
      where: { userId: firstUser.id }
    });
    
    // We assume the frontend parsed items to match: { productId, quantity, price }
    const orderItems = data.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.price,
    }));

    return this.prisma.order.create({
      data: {
        userId: firstUser.id,
        addressId: userAddress ? userAddress.id : '', // Normally would enforce this
        shippingAddressSnapshot: JSON.stringify({
          fullName: firstUser.name,
          phone: firstUser.phone || '',
          addressLine: data.shippingAddress,
          province: '',
          postalCode: ''
        }),
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'PAID', // Instant mock
        status: 'PENDING',
        items: {
          create: orderItems,
        }
      }
    });
  }
}
