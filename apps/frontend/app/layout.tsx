import type { Metadata } from "next";
import { Noto_Sans_Thai, Prompt } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../store/useCartStore";
import { Toaster } from "sonner";
import CartDrawer from "../components/cart/CartDrawer";

const bodyFont = Noto_Sans_Thai({
  variable: "--font-body",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const displayFont = Prompt({
  variable: "--font-display",
  subsets: ["latin", "thai"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kbon Platform | Smart Hydroponic Commerce",
  description: "แพลตฟอร์มอุปกรณ์และระบบอัตโนมัติสำหรับฟาร์มไฮโดรโปนิกส์ยุคใหม่",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${bodyFont.variable} ${displayFont.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
