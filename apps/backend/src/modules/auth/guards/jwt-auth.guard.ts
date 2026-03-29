import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// นี่คือการสร้างคลาสยาม โดยบอกว่าให้ใช้กฎของ 'jwt' (ที่เราตั้งค่าไว้ใน strategy)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}