import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Public endpoint is nested under products for a RESTful URL:
 *   GET /products/:productId/reviews
 *
 * Admin endpoints are under /admin/reviews to keep them clearly separated:
 *   GET    /admin/reviews
 *   PATCH  /admin/reviews/:id/status
 *   DELETE /admin/reviews/:id
 */
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ─── PUBLIC ─────────────────────────────────────────────────────────────────

  /**
   * GET /products/:productId/reviews
   * Returns only APPROVED reviews for the given product, with anonymized names.
   */
  @Get('products/:productId/reviews')
  findApprovedByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findApprovedByProduct(productId);
  }

  // ─── AUTHENTICATED USER ──────────────────────────────────────────────────────

  /**
   * GET /reviews/eligibility/:productId
   * Returns { eligible: boolean, reason?: string } for the current user.
   */
  @Get('reviews/eligibility/:productId')
  @UseGuards(JwtAuthGuard)
  checkEligibility(@Req() req: any, @Param('productId') productId: string) {
    return this.reviewsService.checkEligibility(req.user.id, productId);
  }

  /**
   * POST /reviews
   * Creates a new review from a verified buyer. Auto-approved.
   */
  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createReview(@Req() req: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(req.user.id, dto);
  }

  // ─── ADMIN ──────────────────────────────────────────────────────────────────

  /**
   * GET /admin/reviews
   * Returns all reviews across all products (any status) for admin moderation.
   */
  @Get('admin/reviews')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.reviewsService.findAll();
  }

  /**
   * PATCH /admin/reviews/:id/status
   * Approves or rejects a review.
   */
  @Patch('admin/reviews/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReviewStatusDto,
  ) {
    return this.reviewsService.updateStatus(id, dto);
  }

  /**
   * DELETE /admin/reviews/:id
   * Permanently removes a review.
   */
  @Delete('admin/reviews/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
