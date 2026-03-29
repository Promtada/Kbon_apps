import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. สมัครสมาชิก (Register) - คุณทำผ่านแล้ว
  async register(createAuthDto: CreateAuthDto) {
    const { email, password, name } = createAuthDto;

    if (!email?.trim() || !password?.trim()) {
      throw new BadRequestException('Email and password are required.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userName = name?.trim() || email.split('@')[0];

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: userName,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // 2. เรียกดู User ทั้งหมด (Find All) - สำหรับเทสที่คุณต้องการ
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc', // เรียงจากใหม่ไปเก่า
      },
    });
  }

  // 3. เรียกดู User รายคนตาม ID
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // 4. อัปเดตข้อมูล User
  async update(id: string, updateAuthDto: UpdateAuthDto) {
    // เช็คก่อนว่ามี user ไหม
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateAuthDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  // 5. ลบ User
  async remove(id: string) {
    await this.findOne(id); // เช็คก่อนลบ
    return this.prisma.user.delete({
      where: { id },
    });
  }
}