import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // --- 🌟 ฟังก์ชันช่วยสร้าง Tokens คู่ (Access & Refresh) ---
  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }), // ใบหลัก 15 นาที
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),  // ใบสำรอง 7 วัน
    ]);

    return { accessToken, refreshToken };
  }

  // --- 1. ฟังก์ชัน Login (อัปเกรดให้สร้าง Session) ---
  async login(loginDto: any) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // บันทึกลงตาราง Session (Refresh Token Rotation)
    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 วัน
      },
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  // --- 🌟 ฟังก์ชันใหม่: ใช้กุญแจสำรองมาแลกกุญแจใหม่ (Refresh) ---
  async refresh(refreshToken: string) {
    try {
      // 1. ตรวจสอบความถูกต้องของ Token (Verify JWT)
      const payload = await this.jwtService.verifyAsync(refreshToken);
      
      // 2. เช็คในตาราง Session ว่ามีกุญแจนี้จริงและยังไม่หมดอายุ
      const session = await this.prisma.session.findUnique({
        where: { refreshToken },
      });

      if (!session || session.expiresAt < new Date()) {
        if (session) await this.prisma.session.delete({ where: { id: session.id } });
        throw new UnauthorizedException('Session expired');
      }

      // 3. สร้างกุญแจชุดใหม่
      const newTokens = await this.generateTokens(payload.sub, payload.email, payload.role);

      // 4. อัปเดต Session เดิมด้วยกุญแจใหม่ (Rotate)
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          refreshToken: newTokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return newTokens;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // --- 2. ฟังก์ชันเดิม (คงไว้ทั้งหมด) ---
  async register(createAuthDto: CreateAuthDto) {
    const { email, password, name } = createAuthDto;
    if (!email?.trim() || !password?.trim()) {
      throw new BadRequestException('Email and password are required.');
    }
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictException('Email is already registered.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const userName = name?.trim() || email.split('@')[0];

    return this.prisma.user.create({
      data: { email, password: hashedPassword, name: userName },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: updateAuthDto,
      select: { id: true, email: true, name: true, role: true },
    });
  }

  // --- 🌟 อัปเดตโปรไฟล์ของ User ที่ล็อกอินอยู่ ---
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.findOne(userId);

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.dob !== undefined) data.dob = new Date(dto.dob);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    const { password, ...result } = user;
    return result;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}