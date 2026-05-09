import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';

// Every field from CreateBlogDto becomes optional,
// so PATCH can update a single field (e.g. published) or all of them.
export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
