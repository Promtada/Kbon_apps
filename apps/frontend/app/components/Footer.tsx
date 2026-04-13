import Link from 'next/link';
import { ArrowUpRight, Leaf, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = [
  { label: 'หน้าแรก', href: '/' },
  { label: 'สินค้า', href: '/products' },
  { label: 'เกี่ยวกับเรา', href: '/about' },
  { label: 'ติดต่อเรา', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-white">
      <div className="page-shell py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E] text-white shadow-[0_8px_20px_rgba(34,197,94,0.2)]">
                <Leaf size={18} />
              </div>
              <div>
                <p className="font-display text-xl font-extrabold tracking-tight text-slate-900">
                  Kbon Platform
                </p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Smart hydroponic commerce
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-500">
              แพลตฟอร์มอุปกรณ์และระบบอัตโนมัติสำหรับฟาร์มไฮโดรโปนิกส์ยุคใหม่
              ออกแบบมาเพื่อให้การปลูกเป็นเรื่องง่ายและแม่นยำ
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#22C55E] transition-colors duration-200 hover:text-[#16A34A]"
            >
              คุยกับทีมงาน
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Navigate
            </p>
            <div className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm font-medium text-slate-600 transition-colors hover:text-[#22C55E]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Explore
            </p>
            <div className="mt-5 space-y-3 text-sm font-medium text-slate-600">
              <p>ระบบอัตโนมัติ</p>
              <p>Nutrients & pH</p>
              <p>Hardware สำหรับฟาร์ม</p>
              <p>ชุดเริ่มต้นสำหรับมือใหม่</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Contact
            </p>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <a
                href="mailto:support@kbon.com"
                className="flex items-start gap-3 font-medium transition-colors hover:text-[#22C55E]"
              >
                <Mail size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <span>support@kbon.com</span>
              </a>
              <a
                href="tel:0889914444"
                className="flex items-start gap-3 font-medium transition-colors hover:text-[#22C55E]"
              >
                <Phone size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <span>088-991-XXXX</span>
              </a>
              <div className="flex items-start gap-3 font-medium">
                <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <span>ตำบลน้ำน้อย อำเภอหาดใหญ่ จังหวัดสงขลา 90110</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-100 pt-6 text-center text-sm font-medium text-slate-400">
          © 2026 Kbon Platform. Built for modern hydroponic teams.
        </div>
      </div>
    </footer>
  );
}
