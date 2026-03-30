import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockProducts = [
  // ---- AUTOMATION (5) ----
  {
    name: 'Kbon Smart pH Controller V2',
    description: 'เครื่องควบคุมค่า pH อัตโนมัติรุ่นอัปเกรด มาพร้อมระบบจ่ายสั่งการผ่านสมาร์ทโฟนและเซนเซอร์ความแม่นยำระดับอุตสาหกรรม',
    price: 12900,
    originalPrice: 14900,
    stock: 15,
    category: 'Automation',
    warranty: '2 ปี',
    features: ['ควบคุมแบบ Real-time', 'เซนเซอร์เกรดอุตสาหกรรมเยอรมัน', 'รองรับ WiFi 2.4GHz'],
    isPublished: true,
    sku: 'KB-AUTO-PH2',
    mainImageUrl: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Main Controller Unit', subtitle: 'กล่องสมองกลหลัก', imageUrl: '' },
      { title: 'pH Probe Sensor', subtitle: 'หัววัดค่า pH', imageUrl: '' },
      { title: 'Peristaltic Pump', subtitle: 'ปั๊มสูบจ่าย 2 หัว', imageUrl: '' }
    ],
    techSpecs: [
      { title: 'Connectivity', description: 'WiFi 2.4GHz b/g/n' },
      { title: 'Power Input', description: '12V DC (Adapter Included)' }
    ]
  },
  {
    name: 'Kbon EC/TDS Doser System',
    description: 'ระบบจ่ายธาตุอาหารอัตโนมัติ แม่นยำทุกหยด รักษาค่า EC ให้เสถียรเพื่อการเติบโตที่สมบูรณ์แบบ',
    price: 14500,
    originalPrice: 15500,
    stock: 8,
    category: 'Automation',
    warranty: '1 ปี',
    features: ['ปั๊มรีดท่อคุณภาพสูง', 'ตั้งเวลาล่วงหน้าได้', 'แจ้งเตือนผ่านแอป'],
    isPublished: true,
    sku: 'KB-AUTO-EC1',
    mainImageUrl: 'https://images.unsplash.com/photo-1520699918507-3c3e05c46b0c?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Doser Unit', subtitle: 'ชุดปั๊มสูบจ่าย A+B', imageUrl: '' },
      { title: 'EC Probe', subtitle: 'หัววัดค่าความนำไฟฟ้า', imageUrl: '' }
    ],
    techSpecs: [
      { title: 'Pump Flow', description: '50ml / minute' },
      { title: 'Water Resistance', description: 'IP65 Enclosure' }
    ]
  },
  {
    name: 'Kbon Master Hub Pro',
    description: 'ศูนย์กลางควบคุมทุกอุปกรณ์ไฮโดรโปนิกส์ในฟาร์มของคุณ เชื่อมต่อและสั่งการได้หลายโซนพร้อมกัน',
    price: 9900,
    originalPrice: null,
    stock: 25,
    category: 'Automation',
    warranty: '1 ปี',
    features: ['รองรับ 10 อุปกรณ์', 'บันทึกข้อมูลย้อนหลัง 1 ปี', 'จอทัชสกรีนในตัว'],
    isPublished: true,
    sku: 'KB-HUB-PRO',
    mainImageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Master Hub Console', subtitle: 'หน้าจอควบคุมศูนย์กลาง', imageUrl: '' },
      { title: 'Mounting Kit', subtitle: 'ชุดยึดติดผนัง', imageUrl: '' }
    ],
    techSpecs: [
      { title: 'Display', description: '7" IPS Touchscreen' },
      { title: 'Protocol', description: 'Zigbee 3.0 / WiFi' }
    ]
  },
  {
    name: 'Smart Environment Sensor',
    description: 'เซนเซอร์วัดค่าอุณหภูมิและความชื้นอากาศ เชื่อมต่อไร้สาย แบตเตอรี่อึดทนทาน',
    price: 1250,
    originalPrice: 1500,
    stock: 60,
    category: 'Automation',
    warranty: '6 เดือน',
    features: ['เซนเซอร์ SHT30', 'แบตเตอรี่อยู่ได้ 2 ปี', 'รองรับ Apple HomeKit'],
    isPublished: true,
    sku: 'KB-SENS-ENV',
    mainImageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Sensor Body', subtitle: 'ตัววัดสภาพอากาศ', imageUrl: '' },
      { title: 'CR2032 Battery', subtitle: 'ถ่านแบนเซนเซอร์', imageUrl: '' }
    ],
    techSpecs: [
      { title: 'Temp Range', description: '-10 to 60°C' },
      { title: 'Humidity Range', description: '0-99% RH' }
    ]
  },
  {
    name: 'Auto-Valve Water Level Controller',
    description: 'อุปกรณ์เติมน้ำอัตโนมัติ รักษาระดับน้ำในถังสารอาหารไม่เคยพร่อง ป้องกันปั๊มไหม้',
    price: 2450,
    originalPrice: 3000,
    stock: 12,
    category: 'Automation',
    warranty: '1 ปี',
    features: ['วาล์วไฟฟ้าทองเหลือง', 'เซนเซอร์ลูกลอยแม่เหล็ก', 'ตัดไฟอัตโนมัติเมื่อน้ำรั่ว'],
    isPublished: true,
    sku: 'KB-VALV-LVL',
    mainImageUrl: 'https://images.unsplash.com/photo-1606518778810-09ddacde54af?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Solenoid Valve', subtitle: 'วาล์วไฟฟ้า 1/2"', imageUrl: '' },
      { title: 'Float Sensor', subtitle: 'เซนเซอร์ลูกลอย', imageUrl: '' }
    ],
    techSpecs: []
  },

  // ---- SET (5) ----
  {
    name: 'Starter Grow Kit แบบน้ำนิ่ง',
    description: 'ชุดปลูกไฮโดรโปนิกส์สำหรับผู้เริ่มต้น (ระบบ Kratky) ปลูกง่ายไม่ต้องง้อปั๊มน้ำ',
    price: 590,
    originalPrice: null,
    stock: 100,
    category: 'Set',
    warranty: 'ไม่มีรับประกัน',
    features: ['ปุ๋ยฟรีในชุด', 'ฟองน้ำเพาะเมล็ด 1 แผ่น', 'ถ้วยปลูก 12 ใบ'],
    isPublished: true,
    sku: 'KB-SET-STD01',
    mainImageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Grow Box', subtitle: 'กล่องปลูกพลาสติกทึบแสง', imageUrl: '' },
      { title: 'Seed Pack', subtitle: 'เมล็ดสลัดรวม 100 เมล็ด', imageUrl: '' }
    ],
    techSpecs: [
      { title: 'Capacity', description: '12 หลุมปลูก' }
    ]
  },
  {
    name: 'NFT Professional System (2 เมตร)',
    description: 'ชุดปลูกระบบราง NFT มาตรฐานฟาร์ม โครงอลูมิเนียมกันสนิมพร้อมระบบปั๊มน้ำวน',
    price: 4900,
    originalPrice: 5500,
    stock: 10,
    category: 'Set',
    warranty: 'โครงสร้าง 5 ปี',
    features: ['ราง NFT หนา 2มม.', 'ท่อส่งน้ำ PE อย่างดี', 'ปลูกได้ 40 ต้น'],
    isPublished: true,
    sku: 'KB-SET-NFT2M',
    mainImageUrl: 'https://images.unsplash.com/photo-1530836369250-ef71a3f5e902?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'NFT Pipes', subtitle: 'รางปลูก 4 เส้น', imageUrl: '' },
      { title: 'Water Pump', subtitle: 'ปั๊มน้ำรุ่น SOBO AP1000', imageUrl: '' }
    ],
    techSpecs: [
      { title: 'Dimensions', description: '200 x 50 x 80 cm' }
    ]
  },
  {
    name: 'Smart Indoor Grow Tent Bundle',
    description: 'ชุดเต็นท์ปลูกต้นไม้ในร่มขจัดปัญหากลิ่นและแมลง พร้อมระบบไฟ LED ครบชุด',
    price: 18500,
    originalPrice: 22000,
    stock: 3,
    category: 'Set',
    warranty: '1 ปี',
    features: ['เต็นท์ Mylar 600D', 'ไฟ GrowLight 240W', 'พัดลมดูดอากาศคาร์บอนฟิลเตอร์'],
    isPublished: true,
    sku: 'KB-TENT-BUNDLE',
    mainImageUrl: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Grow Tent 80x80x160', subtitle: 'เต็นท์ปลูก', imageUrl: '' },
      { title: 'LED Quantum Board', subtitle: 'ไฟปลูกต้นไม้', imageUrl: '' }
    ],
    techSpecs: []
  },
  {
    name: 'Microgreens Easy Farm Kit',
    description: 'ชุดปลูกต้นอ่อนยอดฮิต โตไวภายใน 7 วัน ทานได้ทั้งครอบครัว',
    price: 350,
    originalPrice: 490,
    stock: 80,
    category: 'Set',
    warranty: 'ไม่มีรับประกัน',
    features: ['วัสดุปลูกไร้ดิน', 'เมล็ดทานตะวัน+หัวไชเท้า', 'ถาดเพาะ 2 ชั้น'],
    isPublished: true,
    sku: 'KB-SET-MICRO',
    mainImageUrl: 'https://plus.unsplash.com/premium_photo-1664115166465-985eb93d25fe?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Cultivation Tray', subtitle: 'ถาดมีรูและไม่มีรู', imageUrl: '' },
      { title: 'Hemp Mat', subtitle: 'แผ่นปลูก', imageUrl: '' }
    ],
    techSpecs: []
  },
  {
    name: 'Dutch Bucket System 10-Pot',
    description: 'ชุดปลูกระบบน้ำหยดความจุ 10 ถัง เหมาะสำหรับพืชลูกหยั่งรากลึกเช่น มะเขือเทศ หรือ เมล่อน',
    price: 3200,
    originalPrice: null,
    stock: 15,
    category: 'Set',
    warranty: 'โครงสร้าง 1 ปี',
    features: ['ถัง Bato Bucket ทน UV', 'ระบบน้ำหยดครบชุด', 'ปั๊มสูบแรงดันสูง'],
    isPublished: true,
    sku: 'KB-SET-DUTCH10',
    mainImageUrl: 'https://images.unsplash.com/photo-1592424001806-081cf41c7b89?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Dutch Buckets', subtitle: '10 ใบ', imageUrl: '' }
    ],
    techSpecs: []
  },

  // ---- NUTRIENT (5) ----
  {
    name: 'Premium Nutrient Mix A+B (1 ลิตร)',
    description: 'ปุ๋ยอาหารพืชคุณภาพสูง AB สูตรเฉพาะสำหรับสลัดและผักกินใบ แร่ธาตุครบดูดซึมง่าย',
    price: 250,
    originalPrice: 300,
    stock: 200,
    category: 'Nutrient',
    warranty: 'ไม่มีรับประกัน',
    features: ['ไนโตรเจนสูง', 'พืชโตไว ใบกรอบ', 'ไม่ตกตะกอนง่าย'],
    isPublished: true,
    sku: 'KB-NUT-AB1L',
    mainImageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Nutrient A', subtitle: '1 ลิตร', imageUrl: '' },
      { title: 'Nutrient B', subtitle: '1 ลิตร', imageUrl: '' }
    ],
    techSpecs: []
  },
  {
    name: 'pH Down - Phosphoric Acid 85%',
    description: 'น้ำยาปรับลดค่า pH ชนิดความเข้มข้นสูง สำหรับสมดุลน้ำในไฮโดรโปนิกส์ให้อยู่ในระดับ 5.5 - 6.5',
    price: 150,
    originalPrice: null,
    stock: 150,
    category: 'Nutrient',
    warranty: 'ไม่มีรับประกัน',
    features: ['ใช้แค่นิดเดียว', 'ไม่เป็นอันตรายต่อราก', 'เกรดอาหาร (Food Grade)'],
    isPublished: true,
    sku: 'KB-NUT-PHDOWN',
    mainImageUrl: 'https://plus.unsplash.com/premium_photo-1678122394541-e945e412d0c2?q=80&w=800&auto=format&fit=crop',
    includedItems: [],
    techSpecs: []
  },
  {
    name: 'pH Up - Potassium Hydroxide',
    description: 'น้ำยาปรับเพิ่มค่า pH ในกรณีที่น้ำเป็นกรดเกินไป เพิ่มธาตุโพแทสเซียมให้พืชทางอ้อม',
    price: 150,
    originalPrice: null,
    stock: 120,
    category: 'Nutrient',
    warranty: 'ไม่มีรับประกัน',
    features: ['ละลายน้ำง่าย', 'ปลอดภัย ไร้สารตกค้าง'],
    isPublished: true,
    sku: 'KB-NUT-PHUP',
    mainImageUrl: 'https://images.unsplash.com/photo-1616782481977-cb0208fa7563?q=80&w=800&auto=format&fit=crop',
    includedItems: [],
    techSpecs: []
  },
  {
    name: 'Root Booster Extract 100ml',
    description: 'สารสกัดสาหร่ายทะเลสีน้ำตาล เร่งการแตกรากพืช ลดความเครียดตอนย้ายกล้า',
    price: 490,
    originalPrice: 590,
    stock: 45,
    category: 'Nutrient',
    warranty: 'ไม่มีรับประกัน',
    features: ['เร่งราก 3X', 'ฟื้นฟูรากเน่า', 'สารอินทรีย์ 100%'],
    isPublished: true,
    sku: 'KB-NUT-ROOT',
    mainImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
    includedItems: [],
    techSpecs: []
  },
  {
    name: 'Cal-Mag Plus Supplement 500ml',
    description: 'อาหารเสริมแคลเซียมและแมกนีเซียม แก้ปัญหาใบหงิก ปลายใบไหม้ สำหรับพืชที่ปลูกในน้ำ RO',
    price: 320,
    originalPrice: null,
    stock: 65,
    category: 'Nutrient',
    warranty: 'ไม่มีรับประกัน',
    features: ['ดูดซึมทันที', 'เสริมโครงสร้างเซลล์'],
    isPublished: true,
    sku: 'KB-NUT-CALMAG',
    mainImageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=800&auto=format&fit=crop',
    includedItems: [],
    techSpecs: []
  },

  // ---- HARDWARE (5) ----
  {
    name: 'LED Grow Light Quantum Board 240W',
    description: 'หลอดไฟ LED สำหรับปลูกต้นไม้ในร่ม Full Spectrum เลียนแบบแสงอาทิตย์ได้ใกล้เคียงที่สุด',
    price: 5900,
    originalPrice: 6500,
    stock: 20,
    category: 'Hardware',
    warranty: '2 ปี',
    features: ['Samsung LM301H Diodes', 'MeanWell Driver', 'ปรับลดแสงได้ (Dimmable)'],
    isPublished: true,
    sku: 'KB-HW-LED240',
    mainImageUrl: 'https://images.unsplash.com/photo-1563200057-7977a41ecfcb?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'LED Board', subtitle: 'แผงไฟปลูกต้นไม้', imageUrl: '' },
      { title: 'Power Driver', subtitle: 'ไดร์เวอร์จ่ายไฟ', imageUrl: '' }
    ],
    techSpecs: [
      { title: 'Power Output', description: '240 Watts' },
      { title: 'Coverage', description: '120x60 cm' }
    ]
  },
  {
    name: 'Submersible Water Pump AP-1000',
    description: 'ปั๊มน้ำแช่คุณภาพสูงสำหรับระบบไฮโดรโปนิกส์ ทำงานเงียบ และประหยัดไฟ',
    price: 350,
    originalPrice: null,
    stock: 50,
    category: 'Hardware',
    warranty: '6 เดือน',
    features: ['ปั๊มขึ้นสูง 1 เมตร', 'แกนสแตนเลส'],
    isPublished: true,
    sku: 'KB-HW-PUMP1K',
    mainImageUrl: 'https://images.unsplash.com/photo-1534017684618-2ba4073fb8eb?q=80&w=800&auto=format&fit=crop',
    includedItems: [],
    techSpecs: [
      { title: 'Flow Rate', description: '400 L/hr' },
      { title: 'Power', description: '8W' }
    ]
  },
  {
    name: 'Inline Duct Fan 4 นิ้ว (พัดลมดูดอากาศ)',
    description: 'พัดลมดูด หรือเป่าอากาศ สำหรับระบบเต็นท์ปลูก เร่งการระบายความร้อน กลิ่น และความชื้น',
    price: 1800,
    originalPrice: 2100,
    stock: 35,
    category: 'Hardware',
    warranty: '1 ปี',
    features: ['ปรับความเร็วได้', 'ทำงานเงียบ 32dB'],
    isPublished: true,
    sku: 'KB-HW-FAN4',
    mainImageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=800&auto=format&fit=crop',
    includedItems: [],
    techSpecs: []
  },
  {
    name: 'Sponge Rockwool Cubes (แผ่นเพาะเมล็ดแบบฟองน้ำ)',
    description: 'ฟองน้ำคุณภาพ เกรดไฮเปอร์สเปซ ดูดซึมน้ำดี ไม่สะสมเชื้อรา เหมาะกับการเริ่มปลูกทุกชนิด',
    price: 60,
    originalPrice: null,
    stock: 300,
    category: 'Hardware',
    warranty: 'ไม่มีรับประกัน',
    features: ['กรีดร่องพร้อมปลูก', '1 แผ่น 96 หลุม'],
    isPublished: true,
    sku: 'KB-HW-SPONGE',
    mainImageUrl: 'https://images.unsplash.com/photo-1606518778810-09ddacde54af?q=80&w=800&auto=format&fit=crop', // Reusing placeholder abstract texture
    includedItems: [],
    techSpecs: []
  },
  {
    name: 'Net Cups (ถ้วยปลูกสีขาว ขอบหนา)',
    description: 'ถ้วยปลูกไฮโดรโพนิกส์ ขนาดมาตรฐาน ไซส์ปาก 5 เซนติเมตร ทนแสง UV ไม่กรอบแตกง่าย ผิวเรียบลื่นรากเกาะง่าย',
    price: 100,
    originalPrice: 150,
    stock: 500,
    category: 'Hardware',
    warranty: 'เปลี่ยนคืนได้กรณีหัก',
    features: ['แพ็ค 100 ใบ', 'Plastic เกรดอาหาร', 'ล้างใช้ซ้ำได้'],
    isPublished: true,
    sku: 'KB-HW-CUP100',
    mainImageUrl: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=800&auto=format&fit=crop',
    includedItems: [],
    techSpecs: [
      { title: 'Size', description: '5cm Diameter' }
    ]
  }
];

async function main() {
  console.log('🌱 Cleansing database... existing products are being removed.');
  await prisma.product.deleteMany();

  console.log('✨ Seeding 20 mock hydroponics and automation products...');
  for (const productData of mockProducts) {
    const p = await prisma.product.create({
      data: {
        ...productData,
        includedItems: productData.includedItems,
        techSpecs: productData.techSpecs,
      }
    });
    console.log(` • Created: ${p.name}`);
  }

  console.log('✅ Seeding completed beautifully.');
}

main()
  .catch((e) => {
    console.error('Error executing seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
