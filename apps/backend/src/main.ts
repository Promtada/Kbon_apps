import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'; // เพิ่มตัวนี้
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 0. ให้บริการไฟล์ Static (รูปภาพ/วิดีโอ) ที่อัปโหลดมา
  const uploadsPath = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // 1. ปลดล็อค CORS: สำคัญมากเพื่อให้ Frontend (พอร์ต 3000) ยิงมาหา Backend (พอร์ต 4000) ได้
  app.enableCors({
    origin: 'http://localhost:3000', // ระบุ URL ของหน้าเว็บเรา
    credentials: true,
  });

  // 2. ตั้งค่า Prefix: ทำให้ทุก API มีคำว่า /api นำหน้า (เช่น http://localhost:4000/api/auth/login)
  // เพื่อแยกเส้นทาง API ออกจากส่วนอื่นๆ ของเซิร์ฟเวอร์
  app.setGlobalPrefix('api');

  // 3. ValidationPipe: ตรวจสอบข้อมูลที่ User ส่งมาให้อัตโนมัติ (เช่น ถ้าลืมส่งอีเมลมา จะแจ้งเตือนทันที)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ตัดข้อมูลที่ไม่ได้อยู่ใน DTO ทิ้งไป (ป้องกันการแอบส่งข้อมูลแปลกปลอม)
      transform: true, // แปลงประเภทข้อมูลให้อัตโนมัติ (เช่น string -> number)
    }),
  );

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  
  // พิมพ์ข้อความให้เรากดยิงได้ง่ายๆ ในหน้าจอ Terminal
  console.log(`\n🚀 Kbon Backend is running on: http://localhost:${port}/api\n`);
}
bootstrap();