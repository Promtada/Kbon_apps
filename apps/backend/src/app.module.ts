// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [PrismaModule, AuthModule, ProductsModule, SettingsModule, UploadsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}