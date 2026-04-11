📦 สิ่งที่ต้องมีในเครื่อง (Prerequisites)
Docker Desktop: ดาวน์โหลดที่นี่ (ต้องติดตั้งและเปิดโปรแกรมไว้ก่อนรัน)

Stripe CLI: (เฉพาะเมื่อต้องการทดสอบระบบชำระเงิน) วิธีติดตั้ง

🔑 ขั้นตอนที่ 1: ตั้งค่ากุญแจระบบ (.env)
เพื่อนต้องสร้างไฟล์ .env ไว้ใน 2 ตำแหน่งหลัก โดยก๊อปปี้ค่าด้านล่างนี้ไปวางได้เลยครับ:

1. ไฟล์สำหรับ Backend (apps/backend/.env)
Code snippet
DATABASE_URL="postgresql://postgres:password@localhost:5434/kbon_db?schema=public"

JWT_SECRET="Kbon_Super_Secret_Key_2026"
JWT_EXPIRES_IN="7d"


# Stripe API Keys 
STRIPE_SECRET_KEY=.........
STRIPE_WEBHOOK_SECRET=.........
2. ไฟล์สำหรับ Database (packages/database/.env)
Code snippet
DATABASE_URL="postgresql://postgres:password@localhost:5434/kbon_db?schema=public"

JWT_SECRET="Kbon_Super_Secret_Key_2026"
JWT_EXPIRES_IN="7d"

🚀 ขั้นตอนที่ 2: เริ่มต้นรันระบบ (Build & Start)
เปิด Terminal ที่โฟลเดอร์นอกสุดของโปรเจกต์ (Root) แล้วพิมพ์คำสั่งประกาศิตนี้:

Bash
docker-compose up -d --build
(รอจนกว่า Docker จะประกอบร่างเสร็จและขึ้นสถานะ Started ครบทุกบริการ)

💾 ขั้นตอนที่ 3: เตรียมฐานข้อมูล (Database Init)
เนื่องจากฐานข้อมูลที่รันครั้งแรกจะว่างเปล่า ให้รันคำสั่งนี้เพียง ครั้งเดียว เพื่อสร้างตารางและลงข้อมูลสินค้าตัวอย่าง (Seed Data):

Bash
docker-compose run --rm backend sh -c "cd packages/database && npx prisma db push && npx prisma db seed"
🌐 ช่องทางการเข้าใช้งาน
Frontend (หน้าบ้าน): http://localhost:3000

Backend (API Docs): http://localhost:4000/api

💳 การทดสอบระบบชำระเงิน (Stripe Webhook)
หากต้องการทดสอบ Flow การซื้อสินค้า ให้เปิด Terminal อีกหน้าหนึ่งแล้วรันคำสั่งนี้ทิ้งไว้เพื่อเชื่อมต่อกับ Stripe:

Bash
.\stripe listen --forward-to localhost:4000/api/orders/webhook
(หากได้รับ Webhook Secret ใหม่จากหน้าจอ CLI ให้นำไปอัปเดตค่า STRIPE_WEBHOOK_SECRET ในไฟล์ .env ของ Backend แล้วสั่ง docker-compose restart backend หนึ่งครั้ง)

🔧 คำสั่งที่มีประโยชน์ (Useful Commands)
ดู Log ของหลังบ้าน: docker logs -f kbon-backend

หยุดการทำงานทั้งหมด: docker-compose down

ล้างข้อมูลใหม่ทั้งหมด: docker-compose down -v (คำสั่งนี้จะลบข้อมูลใน Database ทิ้งด้วย)

อัปเดตโค้ดหลังแก้ไฟล์: docker-compose up -d --build

Happy Coding! 🚀 (By KBON Team)