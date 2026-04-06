import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersCronService {
  private readonly logger = new Logger(OrdersCronService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    // Calculate timestamp for 15 minutes ago
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    try {
      // Find orders that are PENDING and older than 15 minutes
      const expiredOrders = await this.prisma.order.findMany({
        where: {
          status: 'PENDING',
          createdAt: {
            lt: fifteenMinutesAgo,
          },
        },
        include: {
          items: true,
        },
      });

      if (expiredOrders.length === 0) {
        return;
      }

      this.logger.log(`Found ${expiredOrders.length} expired pending orders. Processing auto-cancellations...`);

      // Safe Inventory Restoration within an isolated transaction for each order
      for (const order of expiredOrders) {
        await this.prisma.$transaction(async (tx) => {
          // Restore inventory for each item in the order
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }

          // Update order status to CANCELLED
          await tx.order.update({
            where: { id: order.id },
            data: { status: 'CANCELLED' },
          });

          this.logger.log(`Auto-cancelled order #${order.id} and restored inventory for ${order.items.length} items`);
        });
      }
    } catch (error) {
      this.logger.error('Failed to execute auto-cancellation cron job', error);
    }
  }
}
