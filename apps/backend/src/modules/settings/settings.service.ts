import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertSettingsDto } from './dto/upsert-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    let settings = await this.prisma.systemSetting.findUnique({
      where: { id: 'global' },
      include: {
        banners: {
          orderBy: { sortOrder: 'asc' }
        },
        testimonials: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!settings) {
      settings = await this.prisma.systemSetting.create({
        data: { id: 'global' },
        include: { banners: true, testimonials: true }
      });
    }

    return settings;
  }

  async upsertMany(dto: UpsertSettingsDto) {
    const { banners, testimonials, ...settingsData } = dto;

    return this.prisma.$transaction(async (tx) => {
      // Upsert global settings
      const updatedSettings = await tx.systemSetting.upsert({
        where: { id: 'global' },
        update: settingsData,
        create: {
          id: 'global',
          ...settingsData
        },
      });

      // Handle Banners if provided
      if (banners) {
        // Delete all old banners for this setting
        await tx.siteBanner.deleteMany({
          where: { systemSettingId: 'global' }
        });

        // Insert new ones
        if (banners.length > 0) {
          await tx.siteBanner.createMany({
            data: banners.map((b) => ({
              imageUrl: b.imageUrl,
              targetUrl: b.targetUrl,
              isActive: b.isActive !== undefined ? b.isActive : true,
              sortOrder: b.sortOrder || 0,
              systemSettingId: 'global',
            }))
          });
        }
      }

      // Handle Testimonials if provided
      if (testimonials) {
        await tx.testimonial.deleteMany({
          where: { systemSettingId: 'global' }
        });

        if (testimonials.length > 0) {
          await tx.testimonial.createMany({
            data: testimonials.map((t) => ({
              authorName: t.authorName,
              authorRole: t.authorRole,
              content: t.content,
              avatarUrl: t.avatarUrl,
              isActive: t.isActive !== undefined ? t.isActive : true,
              sortOrder: t.sortOrder || 0,
              systemSettingId: 'global',
            }))
          });
        }
      }

      return { success: true };
    });
  }
}
