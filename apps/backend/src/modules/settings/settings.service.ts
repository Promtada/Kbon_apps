import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertSettingsDto } from './dto/upsert-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const settings = await this.prisma.systemSetting.findMany();
    // Return as a key-value object for easy frontend usage
    return settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async upsertMany(dto: UpsertSettingsDto) {
    const results = [];
    // Using transaction for safe atomic updates
    await this.prisma.$transaction(
      dto.settings.map((item) =>
        this.prisma.systemSetting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value },
        })
      )
    );
    return { success: true, count: dto.settings.length };
  }
}
