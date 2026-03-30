import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
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
