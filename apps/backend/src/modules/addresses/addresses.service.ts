import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    return this.prisma.$transaction(async (tx) => {
      // If setting as default, turn off other defaults
      if (createAddressDto.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      } else {
        // If it's their first address, force it to be default
        const count = await tx.address.count({ where: { userId } });
        if (count === 0) {
          createAddressDto.isDefault = true;
        }
      }

      return tx.address.create({
        data: {
          ...createAddressDto,
          userId,
        },
      });
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Optional: If you want latest first. Or sort by isDefault
    });
  }

  async update(userId: string, id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return this.prisma.$transaction(async (tx) => {
      if (updateAddressDto.isDefault) {
        await tx.address.updateMany({
          where: { userId, id: { not: id } },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id },
        data: updateAddressDto,
      });
    });
  }

  async remove(userId: string, id: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return this.prisma.address.delete({
      where: { id },
    });
  }
}
