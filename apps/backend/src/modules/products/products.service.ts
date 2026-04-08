import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

export interface FindAllQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        originalPrice: dto.originalPrice,
        stock: dto.stock ?? 0,
        sku: dto.sku,
        mainImageUrl: dto.mainImageUrl,
        category: dto.category ?? 'Uncategorized',
        warranty: dto.warranty ?? '1 ปี',
        features: dto.features ?? [],
        isPublished: dto.isPublished ?? false,
        includedItems: dto.includedItems ?? null,
        techSpecs: dto.techSpecs ?? null,
      },
    });
  }

  async findAll(query?: FindAllQuery) {
    const where: Prisma.ProductWhereInput = {};

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.category && query.category !== 'ทั้งหมด') {
      where.category = query.category;
    }

    if (query?.minPrice !== undefined || query?.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    if (query?.sortBy) {
      if (query.sortBy === 'price') {
        orderBy = { price: query.sortOrder || 'asc' };
      } else if (query.sortBy === 'createdAt') {
        orderBy = { createdAt: query.sortOrder || 'desc' };
      }
    }

    return this.prisma.product.findMany({
      where,
      orderBy,
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          where: { status: 'APPROVED' },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        images: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id); // throws 404 if not found
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // throws 404 if not found
    return this.prisma.product.delete({ where: { id } });
  }
}
