import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
import { CreateReviewDto } from './dto/create-review.dto';

// String-literal enum stand-ins (resolve to the correct DB values).
// Will be replaced by the real Prisma enum after `prisma generate`.
const ReviewStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Public ────────────────────────────────────────────────────────────────

  /**
   * Returns only APPROVED reviews for a product, with anonymized names.
   */
  async findApprovedByProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) throw new NotFoundException(`Product "${productId}" not found`);

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
   * Checks whether a user is eligible to review a product.
   *
   * Rules:
   *  1. They must have at least one DELIVERED order containing the product.
   *  2. They must not have already submitted a review for this product.
   */
  async checkEligibility(
    userId: string,
    productId: string,
  ): Promise<{ eligible: boolean; reason?: string }> {
    // 1. Has a delivered order with this product?
    const deliveredOrder = await this.prisma.order.findFirst({
      where: {
        userId,
        status: 'DELIVERED',
        isReceivedByUser: true,
        items: { some: { productId } },
      },
      select: { id: true },
    });

    if (!deliveredOrder) {
      return { eligible: false, reason: 'no_delivered_order' };
    }

    // 2. Already reviewed?
    const existingReview = await this.prisma.review.findFirst({
      where: { userId, productId },
      select: { id: true },
    });

    if (existingReview) {
      return { eligible: false, reason: 'already_reviewed' };
    }

    return { eligible: true };
  }

  /**
   * Creates a new review from a verified buyer.
   * Auto-approved so it goes live immediately (post-moderation flow).
   */
  async createReview(userId: string, dto: CreateReviewDto) {
    // Gate on eligibility
    const { eligible, reason } = await this.checkEligibility(userId, dto.productId);

    if (!eligible) {
      if (reason === 'already_reviewed') {
        throw new ConflictException('คุณได้รีวิวสินค้านี้ไปแล้ว');
      }
      throw new ForbiddenException('คุณต้องซื้อและรับสินค้านี้ก่อนจึงจะรีวิวได้');
    }

    // Create review — APPROVED immediately
    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment ?? null,
        productId: dto.productId,
        userId,
        status: ReviewStatus.APPROVED,
      },
    });
  }

  // ── Admin ─────────────────────────────────────────────────────────────────

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        product: { select: { id: true, name: true } },
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateReviewStatusDto) {
    await this.findOneOrFail(id);
    return this.prisma.review.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: string) {
    await this.findOneOrFail(id);
    return this.prisma.review.delete({ where: { id } });
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async findOneOrFail(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException(`Review "${id}" not found`);
    return review;
  }

  private anonymizeName(name: string | null | undefined): string {
    if (!name || name.trim() === '') return 'ผู้ใช้งาน';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    const lastName = parts[parts.length - 1];
    const initial = [...lastName][0];
    return `${parts[0]} ${initial}.`;
  }
}

