import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // ─── Public Endpoints ──────────────────────────────────────────────────────

  /**
   * GET /blogs
   * Returns all published blog posts (public listing, no auth required).
   */
  @Get()
  findAllPublished() {
    return this.blogsService.findAllPublished();
  }

  /**
   * GET /blogs/slug/:slug
   * Returns a single published blog post by its slug (public, no auth required).
   */
  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.blogsService.findOneBySlug(slug);
  }

  // ─── Admin-Only Endpoints ──────────────────────────────────────────────────

  /**
   * GET /blogs/admin
   * Returns all blog posts including drafts (Admin only).
   */
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.blogsService.findAll();
  }

  /**
   * GET /blogs/admin/:id
   * Returns a single blog post by ID, including drafts (Admin only).
   */
  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.findOne(id);
  }

  /**
   * POST /blogs
   * Creates a new blog post (Admin only).
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  /**
   * PATCH /blogs/:id
   * Partially updates a blog post (Admin only).
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(id, updateBlogDto);
  }

  /**
   * DELETE /blogs/:id
   * Removes a blog post (Admin only).
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.remove(id);
  }
}
