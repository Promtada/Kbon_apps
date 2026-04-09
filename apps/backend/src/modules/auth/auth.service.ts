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
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // --- Helper function to generate Access & Refresh Tokens ---
  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }), // 15 minutes
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),  // 7 days
    ]);

    return { accessToken, refreshToken };
  }

  // --- Login function (creates Session) ---
  async login(loginDto: any) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Save to Session table (Refresh Token Rotation)
    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
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

  // --- Refresh Token function ---
  async refresh(refreshToken: string) {
    try {
      // 1. Verify JWT
      const payload = await this.jwtService.verifyAsync(refreshToken);
      
      // 2. Check if token exists in Session and is not expired
      const session = await this.prisma.session.findUnique({
        where: { refreshToken },
      });

      if (!session || session.expiresAt < new Date()) {
        if (session) await this.prisma.session.delete({ where: { id: session.id } });
        throw new UnauthorizedException('Session expired');
      }

      // 3. Generate new tokens
      const newTokens = await this.generateTokens(payload.sub, payload.email, payload.role);

      // 4. Update existing session (Rotate)
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

  // --- Standard CRUD Methods ---
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

  // --- Update Logged-in User Profile ---
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

  // --- Update User Password ---
  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('รหัสผ่านปัจจุบันไม่ถูกต้อง');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { success: true, message: 'อัปเดตรหัสผ่านสำเร็จ' };
  }
}