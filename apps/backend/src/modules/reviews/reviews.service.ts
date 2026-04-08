import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';

// Use string literals that match the Prisma enum values.
// These will align perfectly once `prisma generate` is run.
const ReviewStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;


@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Public: Returns only APPROVED reviews for a given product.
   * Reviewer name is anonymized to "first name + last initial" (e.g. "สมชาย K.")
   */
  async findApprovedByProduct(productId: string) {
    // Verify the product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with id "${productId}" not found`);
    }

    const reviews = await this.prisma.review.findMany({
      where: { productId, status: ReviewStatus.APPROVED },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      reviewerName: this.anonymizeName(r.user?.name ?? r.reviewerName),
    }));
  }

  /**
   * Admin: Returns all reviews across all products with full context.
   */
  async findAll() {
    return this.prisma.review.findMany({
      include: {
        product: { select: { id: true, name: true } },
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin: Updates the moderation status of a review.
   */
  async updateStatus(id: string, dto: UpdateReviewStatusDto) {
    await this.findOneOrFail(id);
    return this.prisma.review.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  /**
   * Admin: Permanently deletes a review.
   */
  async remove(id: string) {
    await this.findOneOrFail(id);
    return this.prisma.review.delete({ where: { id } });
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private async findOneOrFail(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with id "${id}" not found`);
    }
    return review;
  }

  /**
   * Converts "สมชาย กิตติ์" → "สมชาย ก." or "John Smith" → "John S."
   * Falls back to "ผู้ใช้งาน" if no name is available.
   */
  private anonymizeName(name: string | null | undefined): string {
    if (!name || name.trim() === '') return 'ผู้ใช้งาน';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    const lastName = parts[parts.length - 1];
    // Use first codepoint so multi-byte characters (Thai) work correctly
    const initial = [...lastName][0];
    return `${parts[0]} ${initial}.`;
  }
}
