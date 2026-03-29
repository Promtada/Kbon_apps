import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt'; // เพิ่มตัวนี้
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  // เพิ่ม jwtService เข้ามาใน constructor
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // --- 1. ฟังก์ชัน Login (หัวใจของสเต็ปนี้) ---
  async login(loginDto: any) {
    const { email, password } = loginDto;

    // หา User ในฐานข้อมูล
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // เช็คว่ามี User ไหม และรหัสผ่านที่ส่งมา ตรงกับที่ Hash ไว้ใน DB ไหม
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    // สร้างข้อมูลที่จะใส่ในตั๋ว (Payload)
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    // ส่ง Token และข้อมูล User เบื้องต้นกลับไป
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  // --- 2. ฟังก์ชันเดิม (ห้ามลบ) ---
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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}