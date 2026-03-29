import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
// นำเข้าป้ายห้ามเข้า (Guard) จากโฟลเดอร์ guards ที่เราจัดระเบียบไว้
import { JwtAuthGuard } from './guards/jwt-auth.guard'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --- 1. สมัครสมาชิก ---
  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  // --- 2. เข้าสู่ระบบ ---
  @Post('login')
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

  // --- 🌟 3. ข้อมูลโปรไฟล์ (เพิ่มใหม่: ต้องมี Token ถึงจะดึงได้) ---
  @Get('me')
  @UseGuards(JwtAuthGuard) // แปะป้ายห้ามเข้า! ถ้าไม่มีกุญแจจะโดนเตะออก
  getProfile(@Req() req) {
    // ถ้ายามตรวจ Token ผ่าน ข้อมูล User จะถูกแนบมาใน req.user อัตโนมัติ
    return req.user;
  }

  // --- 4. ฟังก์ชันจัดการข้อมูล (CRUD เดิม) ---
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}