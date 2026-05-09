import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new blog post (Admin only).
   */
  async create(dto: CreateBlogDto) {
    try {
      return await this.prisma.blog.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          content: dto.content,
          featuredImage: dto.featuredImage,
          published: dto.published ?? false,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`A blog post with slug "${dto.slug}" already exists`);
      }
      throw error;
    }
  }

  /**
   * Get all published blog posts (Public).
   * Ordered by newest first, excludes full content for listing performance.
   */
  async findAllPublished() {
    return this.prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Get all blog posts including drafts (Admin only).
   */
  async findAll() {
    return this.prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single published blog post by its slug (Public).
   */
  async findOneBySlug(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog || !blog.published) {
      throw new NotFoundException(`Blog post not found`);
    }

    return blog;
  }

  /**
   * Get a single blog post by ID (Admin – includes drafts).
   */
  async findOne(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException(`Blog post with id "${id}" not found`);
    }

    return blog;
  }

  /**
   * Update a blog post by ID (Admin only).
   */
  async update(id: number, dto: UpdateBlogDto) {
    await this.findOne(id); // throws 404 if not found

    try {
      return await this.prisma.blog.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`A blog post with slug "${dto.slug}" already exists`);
      }
      throw error;
    }
  }

  /**
   * Delete a blog post by ID (Admin only).
   */
  async remove(id: number) {
    await this.findOne(id); // throws 404 if not found
    return this.prisma.blog.delete({ where: { id } });
  }
}
