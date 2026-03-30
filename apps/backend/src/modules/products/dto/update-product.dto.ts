import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Every field from CreateProductDto becomes optional,
// so PATCH can update a single field (e.g. isPublished) or all of them.
export class UpdateProductDto extends PartialType(CreateProductDto) {}
