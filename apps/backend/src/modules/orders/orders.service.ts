import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CouponsService } from '../coupons/coupons.service';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private couponsService: CouponsService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }

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

    // 2. คำนวณยอดรวมดิบ (raw subtotal)
    const cartTotalRaw = dto.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    // 2.5 ตรวจสอบและประยุกต์ใช้คูปองหากมี
    let totalAmount = cartTotalRaw;
    let couponId: string | undefined;

    if (dto.couponCode) {
      const validation = await this.couponsService.validateCoupon(dto.couponCode, cartTotalRaw);
      totalAmount = validation.finalTotal;
      couponId = validation.couponId;
    }

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
          couponId: couponId || null,
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

      // 3c. อัปเดต usedCount ของคูปอง
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // (สต็อกสินค้าจะถูกตัดเมื่อลูกค้าชำระเงินสำเร็จผ่าน Webhook แทน)

      return order;
    });
  }
  // --- 🌟 เริ่มกระบวนการชำระเงินด้วย Stripe ---
  async createStripeSession(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException(`ไม่พบคำสั่งซื้อ ${orderId}`);
    }

    if (order.userId !== userId) {
      throw new BadRequestException('คุณไม่มีสิทธิ์เข้าถึงคำสั่งซื้อนี้');
    }

    if (order.paymentStatus === 'PAID') {
      throw new BadRequestException('คำสั่งซื้อนี้ชำระเงินเรียบร้อยแล้ว');
    }

    // 🌟 1. ตรวจสอบสต็อกสินค้าก่อนส่งไปจ่ายเงิน
    for (const item of order.items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(`สินค้า "${item.product.name}" มีจำนวนไม่พอในสต็อก`);
      }
    }

    // แปลงสินค้าเป็นรูปแบบที่ Stripe ต้องการ (หน่วยเป็นสตางค์)
    let lineItems = order.items.map((item) => {
      return {
        price_data: {
          currency: 'thb',
          product_data: {
            name: item.product.name,
            images: item.product.mainImageUrl ? [item.product.mainImageUrl] : [],
          },
          unit_amount: Math.round(item.priceAtPurchase * 100),
        },
        quantity: item.quantity,
      };
    });

    // เพิ่มค่าจัดส่งเข้าไปด้วย (ถ้ามี)
    // หมายเหตุ: order.totalAmount ใน DB คือราคาสุทธิหลังหักส่วนลด (และรวมค่าส่งแล้ว)
    // แต่เราไม่รู้ว่า cartTotal ของสินค้าดิบและส่วนลดเท่าไหร่เพราะ orderItems บันทึกราคาเต็มไว้
    const subtotalRaw = order.items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);

    // คำนวณส่วนลดจาก couponId
    let discountAmount = 0;
    let ephemeralStripeCoupon: Stripe.Coupon | undefined;

    if (order.couponId) {
      // เรียกดูข้อมูล Coupon เพื่อคำนวณส่วนลด
      // @ts-ignore
      const coupon = await this.prisma.coupon.findUnique({ where: { id: order.couponId } });
      if (coupon) {
        if (coupon.discountType === 'FIXED') {
          discountAmount = coupon.discountValue;
        } else {
          discountAmount = subtotalRaw * (coupon.discountValue / 100);
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) discountAmount = coupon.maxDiscount;
        }
        discountAmount = Math.round(discountAmount);

        // สร้าง Stripe Coupon แบบใช้ครั้งเดียว (ephemeral)
        ephemeralStripeCoupon = await this.stripe.coupons.create({
          amount_off: discountAmount * 100, // รพบุหน่วยเป็นสตางค์
          currency: 'thb',
          duration: 'once',
          name: coupon.code,
        });
      }
    }

    const shippingFee = order.totalAmount - (subtotalRaw - discountAmount);
    if (shippingFee > 0 && Math.round(shippingFee) > 0) {
      lineItems.push({
        price_data: {
          currency: 'thb',
          product_data: {
            name: 'ค่าจัดส่ง (Shipping Fee)',
            images: [],
          },
          unit_amount: Math.round(shippingFee * 100),
        },
        quantity: 1,
      });
    }

    // ตรวจสอบขั้นสุดท้ายเพื่อป้องกันปัญหาทศนิยมปัดเศษ หรือส่วนลดที่อาจทำให้ยอดรวมไม่ตรงกับ Database
    const calculatedTotal = lineItems.reduce((acc, item) => acc + (item.price_data.unit_amount * item.quantity), 0) - (discountAmount * 100);
    const expectedTotal = Math.round(order.totalAmount * 100);

    if (calculatedTotal !== expectedTotal) {
      // หากยอดไม่ตรงกัน ให้รวบยอดทั้งหมดเป็น 1 รายการเพื่อป้องกัน Stripe API Error (ยอดที่ลูกค้าจ่ายต้องตรงเป๊ะ)
      lineItems = [{
        price_data: {
          currency: 'thb',
          product_data: {
            name: `ยอดรวมคำสั่งซื้อ #${order.id.slice(-8).toUpperCase()}`,
            images: [],
          },
          unit_amount: expectedTotal, // ยอดจากตาราง Order เป็นศูนย์กลาง
        },
        quantity: 1,
      }];
    }

    try {
      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card', 'promptpay'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `http://localhost:3000/account/orders?success=true`,
        cancel_url: `http://localhost:3000/account/orders`,
        metadata: {
          orderId: order.id,
        },
      };

      if (ephemeralStripeCoupon) {
        sessionConfig.discounts = [{ coupon: ephemeralStripeCoupon.id }];
      }

      const session = await this.stripe.checkout.sessions.create(sessionConfig);

      // บันทึก Stripe Session ID ลงไปใน Order
      await this.prisma.order.update({
        where: { id: order.id },
        // @ts-ignore
        data: { stripeSessionId: session.id },
      });

      return { url: session.url };
    } catch (error) {
      console.error('Stripe session creation failed:', error);
      throw new InternalServerErrorException('ไม่สามารถสร้างเซสชันการชำระเงินได้');
    }
  }

  // --- 🌟 จัดการ Webhook จาก Stripe เมื่อลูกค้าจ่ายเงินเสร็จ ---
  async handleStripeWebhook(signature: string, payload: Buffer) {
    let event: Stripe.Event;
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new InternalServerErrorException('STRIPE_WEBHOOK_SECRET is not configured');
    }

    try {
      // ✅ ตรวจสอบลายเซ็น (Signature) ว่ามาจาก Stripe จริงหรือไม่
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed:`, err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // จัดการเฉพาะเหตุการณ์ที่ชำระเงินสำเร็จ
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // ตรวจสอบวิธีการชำระเงินที่ลูกค้าใช้งานจริงผ่าน PaymentIntent
      let methodStr = 'Stripe';
      try {
        if (session.payment_intent) {
          const pi = await this.stripe.paymentIntents.retrieve(session.payment_intent as string, { expand: ['payment_method'] });
          const pm = pi.payment_method as Stripe.PaymentMethod;
          if (pm?.type === 'promptpay') methodStr = 'PromptPay';
          else if (pm?.type === 'card') methodStr = 'Credit Card';
          else if (pi.payment_method_types?.[0]) {
            methodStr = pi.payment_method_types[0] === 'promptpay' ? 'PromptPay' : 'Credit Card';
          }
        }
      } catch (err) {
        console.error('Failed to retrieve precise payment method:', err);
      }

      // อัปเดตสถานะคำสั่งซื้อจาก UNPAID เป็น PAID และตัดสต็อกสินค้าด้วย Transaction
      try {
        // @ts-ignore - Bypass stale Prisma typings locally
        const order = await this.prisma.order.findUnique({
          // @ts-ignore
          where: { stripeSessionId: session.id },
          // @ts-ignore
          include: { items: true }, 
        });

        if (order) {
          await this.prisma.$transaction(async (tx) => {
            // Step A: อัปเดตสถานะคำสั่งซื้อ
            await tx.order.update({
              where: { id: order.id },
              data: { 
                paymentStatus: 'PAID',
                paymentMethod: methodStr, 
                status: order.status === 'PENDING' ? 'PAID' : order.status, 
              },
            });

            // Step B: ตัดสต็อกสินค้าอย่างปลอดภัย
            // @ts-ignore
            for (const item of order.items) {
              await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
              });
            }
          });
          
          console.log(`✅ Order ${order.id} payment status updated and stock decremented via Webhook.`);
        }
      } catch (err) {
        console.error('Failed to process payment success transaction', err);
      }
    }

    // ตอบกลับ 200 OK ให้ Stripe รู้ว่ารับข้อมูลแล้ว (ถ้าไม่ตอบ Stripe จะส่งมาซ้ำ)
    return { received: true };
  }
}
