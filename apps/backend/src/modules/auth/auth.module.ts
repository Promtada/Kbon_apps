import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
// นำเข้า Strategy ที่เราเพิ่งสร้าง
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'Kbon_Secret',
      signOptions: { expiresIn: '7d' }, // Token หมดอายุใน 7 วัน
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // ใส่ JwtStrategy ลงทะเบียนให้ระบบรู้จัก
  exports: [AuthService],
})
export class AuthModule {}