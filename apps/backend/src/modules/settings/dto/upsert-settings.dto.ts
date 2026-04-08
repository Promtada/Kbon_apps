import { IsString, IsArray, ValidateNested, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertSiteBannerDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  targetUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpsertTestimonialDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  authorName: string;

  @IsOptional()
  @IsString()
  authorRole?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpsertSettingsDto {
  @IsOptional()
  @IsString()
  adminName?: string;

  @IsOptional()
  @IsString()
  adminAvatarUrl?: string;

  @IsOptional()
  @IsString()
  mainHeadline?: string;

  @IsOptional()
  @IsString()
  subHeadline?: string;

  @IsOptional()
  @IsString()
  heroMediaUrl?: string;

  @IsOptional()
  @IsBoolean()
  bannerEnabled?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertSiteBannerDto)
  banners?: UpsertSiteBannerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertTestimonialDto)
  testimonials?: UpsertTestimonialDto[];
}
