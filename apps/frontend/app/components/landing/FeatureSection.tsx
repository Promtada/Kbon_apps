import { Bolt, Droplets, HeadphonesIcon, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: 'Automation ที่แม่นยำ',
    description:
      'ควบคุมการให้น้ำและการจ่ายปุ๋ยแบบต่อเนื่องด้วยระบบอัตโนมัติที่ออกแบบมาเพื่อการปลูกจริง',
    icon: Bolt,
    color: 'bg-emerald-50 text-[#22C55E]',
  },
  {
    title: 'Nutrient System',
    description:
      'สูตรสารละลายและอุปกรณ์ที่ช่วยให้ทีมหน้างานปรับค่า pH/EC ได้ไวขึ้น ลดเวลาลองผิดลองถูก',
    icon: Droplets,
    color: 'bg-blue-50 text-blue-500',
  },
  {
    title: 'Quality Hardware',
    description:
      'คัดชุดอุปกรณ์ที่ทนต่อการใช้งานต่อเนื่อง พร้อมสเปกที่ช่วยตัดสินใจได้เร็วขึ้น',
    icon: ShieldCheck,
    color: 'bg-amber-50 text-amber-500',
  },
  {
    title: 'Expert Support',
    description:
      'ตั้งแต่การเลือกชุดเริ่มต้นไปจนถึงการวาง workflow หน้างาน ทีมงานพร้อมช่วยให้ onboarding ไม่สะดุด',
    icon: HeadphonesIcon,
    color: 'bg-violet-50 text-violet-500',
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="section-shell bg-[#FAFAFA]">
      <div className="page-shell">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="section-kicker mx-auto">Why teams choose Kbon</div>
          <h2 className="section-title mt-6">
            ทุกอย่างที่ทีมต้องการเพื่อฟาร์มที่ดีขึ้น
          </h2>
          <p className="section-copy mt-4">
            โครงสร้างใหม่ถูกออกแบบให้เหมือน SaaS platform ที่เน้น conversion ชัดเจน
            พา user จากการดูสินค้าไปสู่การตัดสินใจได้เร็วขึ้น
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
