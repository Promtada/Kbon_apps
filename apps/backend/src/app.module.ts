// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [PrismaModule, AuthModule, ProductsModule, SettingsModule, UploadsModule, CustomersModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}