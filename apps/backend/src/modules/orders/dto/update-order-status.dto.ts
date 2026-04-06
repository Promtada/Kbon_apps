import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsOptional()
  @IsString()
  @IsEnum(['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
    message: 'สถานะไม่ถูกต้อง (PENDING, PREPARING, SHIPPED, DELIVERED, CANCELLED)',
  })
  status?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['UNPAID', 'PAID', 'REFUNDED'], {
    message: 'สถานะการชำระเงินไม่ถูกต้อง (UNPAID, PAID, REFUNDED)',
  })
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}
