import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    // 1. Total Revenue (sum of all non-cancelled orders)
    const revenueCalc = await this.prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: {
          not: 'CANCELLED',
        },
      },
    });
    const totalRevenue = revenueCalc._sum.totalAmount || 0;

    // 2. Total Orders
    const totalOrders = await this.prisma.order.count();

    // 3. Pending Shipments
    const pendingShipments = await this.prisma.order.count({
      where: {
        status: {
          in: ['PENDING', 'PREPARING'],
        },
      },
    });

    // 4. Low Stock Count
    const lowStockCount = await this.prisma.product.count({
      where: {
        stock: {
          lte: 5,
        },
      },
    });

    // 5. Recent Orders (Top 5)
    // Map it to closely match what the dashboard expects
    const recentOrdersRaw = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
      },
    });
    
    // Format the recent orders for frontend convenience, though the mapping can also be done on the frontend
    const recentOrders = recentOrdersRaw.map((order) => {
      // Create a small snippet to represent the ID
      const shortId = `ORD-${order.id.substring(order.id.length - 4).toUpperCase()}`;
      return {
        id: shortId,
        fullId: order.id,
        customer: order.user?.name || 'Guest User',
        date: order.createdAt,
        status: order.status,
        amount: order.totalAmount,
      };
    });

    // 6. Top Products (Top 4 based on order items)
    const topProductsRaw = await this.prisma.product.findMany({
      take: 4,
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      include: {
        _count: {
          select: { orderItems: true },
        },
      },
    });

    const topProducts = topProductsRaw.map((product) => ({
      id: product.id,
      name: product.name,
      sold: product._count.orderItems,
      image: product.mainImageUrl || 'https://via.placeholder.com/200',
    }));

    return {
      totalRevenue,
      totalOrders,
      pendingShipments,
      lowStockCount,
      recentOrders,
      topProducts,
    };
  }

  async getExportOrdersCsv(): Promise<string> {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    const header = ['Order ID', 'Date', 'Customer Name', 'Status', 'Total Amount'].join(',');
    
    // Add BOM for Excel UTF-8 display
    let csvStr = '\uFEFF' + header + '\n';
    
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      const customerName = `"${order.user?.name || 'Guest User'}"`;
      const amount = order.totalAmount.toString();
      
      const row = [order.id, date, customerName, order.status, amount].join(',');
      csvStr += row + '\n';
    });

    return csvStr;
  }
}
