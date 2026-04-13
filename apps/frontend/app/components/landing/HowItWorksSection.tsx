import { ClipboardList, Radar, Sprout } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'เลือกอุปกรณ์ที่เหมาะกับฟาร์ม',
    description:
      'เริ่มจากสินค้าที่ทีมต้องใช้จริง พร้อมรายละเอียดที่ช่วยให้เทียบความเหมาะสมได้เร็วขึ้น',
    icon: ClipboardList,
  },
  {
    step: '02',
    title: 'วาง Workflow การปลูก',
    description:
      'ต่อยอดจากระบบอัตโนมัติและ nutrient setup ที่ชัดเจน เพื่อให้การทำงานหน้างานสม่ำเสมอ',
    icon: Radar,
  },
  {
    step: '03',
    title: 'ขยายผลผลิตอย่างมั่นใจ',
    description:
      'สั่งซื้อ ติดตาม และตัดสินใจรอบถัดไปได้ไวขึ้นผ่านประสบการณ์ที่ตรงและอ่านง่ายกว่าเดิม',
    icon: Sprout,
  },
];

export function HowItWorksSection() {
  return (
    <section id="workflow" className="section-shell">
      <div className="page-shell">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="section-kicker mx-auto">How it works</div>
          <h2 className="section-title mt-6">
            เริ่มต้นใช้งานได้ใน 3 ขั้นตอน
          </h2>
          <p className="section-copy mt-4">
            ทุก section ถูกจัดให้อ่านได้เร็วบนมือถือและชัดบน desktop
            โดยมี CTA อยู่ในจุดที่พร้อมเปลี่ยนความสนใจเป็นการลงมือ
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connecting Line (desktop) */}
          <div className="absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent lg:block" />

          <ol className="grid gap-8 lg:grid-cols-3">
            {steps.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.step} className="relative">
                  <div className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                    {/* Step Number + Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#22C55E] text-lg font-black text-white shadow-[0_8px_20px_rgba(34,197,94,0.25)]">
                        {item.step}
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#22C55E]">
                        <Icon size={20} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="mt-6 text-xl font-extrabold tracking-tight text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
