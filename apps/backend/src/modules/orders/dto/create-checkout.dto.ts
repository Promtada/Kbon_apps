import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CheckoutItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateCheckoutDto {
  // ---- Shipping Address (inline) ----
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อผู้รับ' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกเบอร์โทรศัพท์' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกที่อยู่' })
  addressLine: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกจังหวัด' })
  province: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกรหัสไปรษณีย์' })
  postalCode: string;

  // ---- Payment ----
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  // ---- Items ----
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];

  @IsOptional()
  @IsString()
  couponCode?: string;
}
