import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockProducts = [
  // ---- AUTOMATION (5) ----
  {
    name: 'Growee Smart pH Controller Pro',
    description: 'Autonomous pH balancing system designed to precisely dose pH Up and Down solutions to maintain optimal nutrient absorption in any hydroponic reservoir.',
    price: 18900,
    originalPrice: 21900,
    stock: 12,
    category: 'Automation',
    warranty: '2 ปี',
    features: ['Auto pH Balancing', 'Real-time Monitoring', 'App Controlled', 'Industrial Grade Probe'],
    isPublished: true,
    sku: 'GRW-PH-PRO',
    mainImageUrl: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Main Controller Console', subtitle: 'Smart Hub v2.0', imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=400&fit=crop' },
      { title: 'pH Probe Sensor', subtitle: 'Lab-grade (Glass)', imageUrl: 'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?q=80&w=400&fit=crop' },
      { title: 'Peristaltic Pump Head', subtitle: 'Dual Output 50ml/min', imageUrl: 'https://images.unsplash.com/photo-1606518778810-09ddacde54af?q=80&w=400&fit=crop' },
      { title: 'Power Adapter', subtitle: '12V 2A DC', imageUrl: 'https://images.unsplash.com/photo-1584981144415-4ba8d6c70817?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Connectivity', description: 'WiFi 2.4GHz 802.11 b/g/n' },
      { title: 'Power Supply', description: '100-240V AC to 12V 2A DC' },
      { title: 'Measurement Range', description: 'pH 0.00 to 14.00' },
      { title: 'Accuracy', description: '± 0.02 pH' }
    ]
  },
  {
    name: 'Kbon EC/TDS Nutrient Doser System',
    description: 'Keep your nutrient levels perfectly dialed in. The Kbon Doser continuously checks electrical conductivity and doses A+B nutrients automatically.',
    price: 15500,
    originalPrice: 16500,
    stock: 8,
    category: 'Automation',
    warranty: '1 ปี',
    features: ['Precision Dosing', 'Dual A+B Support', 'EC Monitoring'],
    isPublished: true,
    sku: 'KB-AUTO-EC1',
    mainImageUrl: 'https://images.unsplash.com/photo-1520699918507-3c3e05c46b0c?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Doser Unit Console', subtitle: 'Motor Control Board', imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400&fit=crop' },
      { title: 'EC Conductivity Probe', subtitle: 'Titanium Pins', imageUrl: 'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?q=80&w=400&fit=crop' },
      { title: 'Silicone Tubing', subtitle: 'Food-grade 5 Meters', imageUrl: 'https://images.unsplash.com/photo-1582719202047-76d34324facc?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Pump Flow Rate', description: '50ml per minute' },
      { title: 'EC Range', description: '0 to 5.0 mS/cm' },
      { title: 'Water Resistance', description: 'IP65 Rated Enclosure' }
    ]
  },
  {
    name: 'Kbon Master Hub Pro 10-Zone',
    description: 'The ultimate central command center for commercial farms. Connect and automate up to 10 independent growing zones from a single beautiful dashboard.',
    price: 35000,
    originalPrice: null,
    stock: 5,
    category: 'Automation',
    warranty: '3 ปี',
    features: ['10 Multi-Zone Support', '7-inch IPS Touchscreen', 'Climate Control Logic', 'Irrigation Timers'],
    isPublished: true,
    sku: 'KB-HUB-PRO-10',
    mainImageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Master Console Device', subtitle: '10-Zone Gateway', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&fit=crop' },
      { title: 'Relay Expansion Box', subtitle: '8-Channel 220V', imageUrl: 'https://images.unsplash.com/photo-1584981144415-4ba8d6c70817?q=80&w=400&fit=crop' },
      { title: 'DIN Rail Mounting Kit', subtitle: 'Industrial Standard', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Display Interface', description: '7" High-brightness IPS Touch' },
      { title: 'Protocols', description: 'Zigbee 3.0, RS485 Modbus, WiFi' },
      { title: 'Data Logging', description: '12-Month Cloud Storage Backup' },
      { title: 'Housing', description: 'Aluminum Alloy Casing' }
    ]
  },
  {
    name: 'Smart Environment Climate Sensor',
    description: 'Precision environmental sensor providing hyper-local temperature, humidity, and VPD (Vapor Pressure Deficit) metrics direct to your smartphone.',
    price: 1850,
    originalPrice: 2200,
    stock: 45,
    category: 'Automation',
    warranty: '1 ปี',
    features: ['VPD Calculation', 'Swiss SHT30 Chip', '2-Year Battery Life'],
    isPublished: true,
    sku: 'KB-SENS-CLIMATE',
    mainImageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Climate Sensor Body', subtitle: 'Ultra-compact Design', imageUrl: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=400&fit=crop' },
      { title: 'CR2032 Coin Battery', subtitle: 'Pre-installed', imageUrl: 'https://images.unsplash.com/photo-1623838493130-9bfa78f0d84c?q=80&w=400&fit=crop' },
      { title: 'Wall Mount Bracket', subtitle: '3M Adhesive', imageUrl: 'https://images.unsplash.com/photo-1584981144415-4ba8d6c70817?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Temperature Range', description: '-10°C to +85°C' },
      { title: 'Humidity Range', description: '0-99% RH (Non-condensing)' },
      { title: 'Connectivity', description: 'Zigbee 3.0 (Hub Required)' },
      { title: 'Accuracy', description: '± 0.3°C / ± 2% RH' }
    ]
  },
  {
    name: 'Auto-Valve Water Level Regulator',
    description: 'Safeguard your water pumps from burning out. This solid brass solenoid valve and float sensor combo keeps your reservoir topped up automatically.',
    price: 2800,
    originalPrice: 3200,
    stock: 22,
    category: 'Automation',
    warranty: '1 ปี',
    features: ['Solid Brass Valve', 'Magnetic Float Sensor', 'Failsafe Auto-shutoff'],
    isPublished: true,
    sku: 'KB-VALV-LVL',
    mainImageUrl: 'https://images.unsplash.com/photo-1606518778810-09ddacde54af?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Brass Solenoid Valve', subtitle: '1/2" Thread 12V', imageUrl: 'https://images.unsplash.com/photo-1606518778810-09ddacde54af?q=80&w=400&fit=crop' },
      { title: 'Optical Float Sensor', subtitle: 'Dual-level detection', imageUrl: 'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?q=80&w=400&fit=crop' },
      { title: 'Smart Relay Switch', subtitle: '10A Control Relay', imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Valve Material', description: 'Solid Forged Brass' },
      { title: 'Operating Pressure', description: '0.02 - 0.8 MPa' },
      { title: 'Operating Voltage', description: '12V DC Safe Voltage' }
    ]
  },

  // ---- SET (5) ----
  {
    name: 'Urban Indoor Grow Tent Bundle',
    description: 'A complete indoor growing solution. Includes a highly reflective Mylar tent, full-spectrum LED light, and a high-efficiency carbon filter exhaust system.',
    price: 24500,
    originalPrice: 28500,
    stock: 4,
    category: 'Set',
    warranty: '1 ปี',
    features: ['120x120x200cm Mylar Tent', '300W LED Grow Light', 'Carbon Filter Ventilation'],
    isPublished: true,
    sku: 'KB-TENT-MAX',
    mainImageUrl: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Premium Grow Tent', subtitle: '120x120x200 600D Mylar', imageUrl: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=400&fit=crop' },
      { title: 'LED Quantum Board', subtitle: '300W Samsung LM301B', imageUrl: 'https://images.unsplash.com/photo-1563200057-7977a41ecfcb?q=80&w=400&fit=crop' },
      { title: 'Carbon Filter System', subtitle: '6-inch Duct + Inline Fan', imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=400&fit=crop' },
      { title: 'Rope Hangers', subtitle: 'Heavy Duty 1/8"', imageUrl: 'https://images.unsplash.com/photo-1584981144415-4ba8d6c70817?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Tent Footprint', description: '1.44 Square Meters' },
      { title: 'Light Spectrum', description: '3000K + 5000K + 660nm Red' },
      { title: 'Exhaust Power', description: '400 CFM Max Output' }
    ]
  },
  {
    name: 'Commercial NFT Hydroponics System (3m)',
    description: 'A professional grade Nutrient Film Technique (NFT) channel system. Grow up to 60 heads of lettuce per unit. Includes rust-proof aluminum framing.',
    price: 8900,
    originalPrice: 11000,
    stock: 6,
    category: 'Set',
    warranty: 'โครงสร้าง 5 ปี',
    features: ['Food-grade PVC Channels', 'Rust-proof Aluminum Frame', '60 Planting Holes'],
    isPublished: true,
    sku: 'KB-SET-NFT3M',
    mainImageUrl: 'https://images.unsplash.com/photo-1530836369250-ef71a3f5e902?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'NFT Channels', subtitle: '3 Meters x 4 Rows', imageUrl: 'https://images.unsplash.com/photo-1592424001806-081cf41c7b89?q=80&w=400&fit=crop' },
      { title: 'Aluminum Frame', subtitle: 'Pre-drilled A-Frame', imageUrl: 'https://images.unsplash.com/photo-1582719202047-76d34324facc?q=80&w=400&fit=crop' },
      { title: 'Submersible Pump', subtitle: '40W High-lift Pump', imageUrl: 'https://images.unsplash.com/photo-1534017684618-2ba4073fb8eb?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'System Dimensions', description: '300 L x 60 W x 120 H (cm)' },
      { title: 'Channel Dimensions', description: '100mm wide x 50mm deep' },
      { title: 'Material', description: 'UV-stabilized Food Grade PVC' }
    ]
  },
  {
    name: 'Starter Kratky Grow Kit',
    description: 'Perfect for beginners. The easiest way to start hydroponic gardening with zero electricity required. Grow your first lettuce in 45 days.',
    price: 690,
    originalPrice: 890,
    stock: 120,
    category: 'Set',
    warranty: 'ไม่มีรับประกัน',
    features: ['No Electricity Needed', 'Includes Seeds & Nutrients', 'Compact Footprint'],
    isPublished: true,
    sku: 'KB-SET-KRATKY',
    mainImageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Reservoir Box', subtitle: '15 Liter Opaque Box', imageUrl: 'https://plus.unsplash.com/premium_photo-1664115166465-985eb93d25fe?q=80&w=400&fit=crop' },
      { title: 'Net Pots + Sponge', subtitle: '8-Hole Setup', imageUrl: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=400&fit=crop' },
      { title: 'Starter Nutrients', subtitle: '250ml A+B Set', imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&fit=crop' },
      { title: 'Premium Seeds', subtitle: 'Green Oak & Red Oak', imageUrl: 'https://images.unsplash.com/photo-1592424001806-081cf41c7b89?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Capacity', description: '15 Liters Water, 8 Plants' },
      { title: 'Dimensions', description: '40 x 30 x 15 cm' }
    ]
  },
  {
    name: 'Dutch Bucket System (10-Pot Expansion)',
    description: 'The industry standard for large fruiting crops like Tomatoes, Cucumbers, and Peppers. Includes 10 buckets with built-in siphon drains.',
    price: 4500,
    originalPrice: 5200,
    stock: 15,
    category: 'Set',
    warranty: 'โครงสร้าง 1 ปี',
    features: ['Drip Emitter System', 'Perlite Included', 'Large Root Volume'],
    isPublished: true,
    sku: 'KB-SET-DUTCH10',
    mainImageUrl: 'https://images.unsplash.com/photo-1592424001806-081cf41c7b89?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Bato Buckets', subtitle: '11 Liter Capacity (x10)', imageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=400&fit=crop' },
      { title: 'Drip Manifold Kit', subtitle: 'Tubing & Emitters', imageUrl: 'https://images.unsplash.com/photo-1606518778810-09ddacde54af?q=80&w=400&fit=crop' },
      { title: 'Siphon Elbows', subtitle: 'Drainage Control', imageUrl: 'https://images.unsplash.com/photo-1582719202047-76d34324facc?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Bucket Volume', description: '11 Liters Per Bucket' },
      { title: 'Drip Rate', description: '2 Liters per Hour (2L/H Emitters)' },
      { title: 'Material', description: 'UV-resistant Heavy Duty PP' }
    ]
  },
  {
    name: 'Microgreens Easy Farm Starter',
    description: 'Grow healthy, nutrient-dense superfoods right on your kitchen counter. Harvest fresh microgreens in just 7-10 days.',
    price: 490,
    originalPrice: 650,
    stock: 50,
    category: 'Set',
    warranty: 'ไม่มีรับประกัน',
    features: ['Soil-less Growing', 'Organic Seeds included', 'No Pests or Mess'],
    isPublished: true,
    sku: 'KB-SET-MICRO',
    mainImageUrl: 'https://plus.unsplash.com/premium_photo-1664115166465-985eb93d25fe?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'BPA-Free Trays', subtitle: '1 Solid, 1 Mesh Bottom', imageUrl: 'https://images.unsplash.com/photo-1592424001806-081cf41c7b89?q=80&w=400&fit=crop' },
      { title: 'Hemp Growing Mats', subtitle: 'Biodegradable (x2)', imageUrl: 'https://plus.unsplash.com/premium_photo-1678122394541-e945e412d0c2?q=80&w=400&fit=crop' },
      { title: 'Organic Seed Mix', subtitle: 'Radish & Sunflower', imageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Tray Dimensions', description: '10x20 inches (Standard 1020)' },
      { title: 'Growth Medium', description: '100% Natural Hemp Fiber' }
    ]
  },

  // ---- NUTRIENT (5) ----
  {
    name: 'Premium Nutrient Formula A+B (2 Liters)',
    description: 'Highly concentrated, high-yield hydroponic base nutrient. Specifically blended for leafy greens and herbs with a perfect macronutrient ratio.',
    price: 450,
    originalPrice: 550,
    stock: 300,
    category: 'Nutrient',
    warranty: 'ไม่มีรับประกัน',
    features: ['No Clogging', 'Chelated Iron', 'Nitrogen Heavy for Greens'],
    isPublished: true,
    sku: 'KB-NUT-AB2L',
    mainImageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Part A Solution', subtitle: 'Calcium/Nitrogen Heavy (1L)', imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&fit=crop' },
      { title: 'Part B Solution', subtitle: 'Phosphorus/Potassium (1L)', imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&fit=crop' },
      { title: 'Measuring Cup', subtitle: '50ml Syringe', imageUrl: 'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'NPK Ratio (Combined)', description: '5-12-26' },
      { title: 'Dilution Rate', description: '5ml of A + 5ml of B per 1 Liter Water' },
      { title: 'Form', description: 'Liquid Concentrate' }
    ]
  },
  {
    name: 'Liquid pH Down (Phosphoric Acid 85%)',
    description: 'Industrial strength acid buffer to safely lower the pH of your hydroponic reservoir. A little goes a very long way.',
    price: 220,
    originalPrice: 290,
    stock: 140,
    category: 'Nutrient',
    warranty: 'ไม่มีรับประกัน',
    features: ['Food Grade', 'Highly Concentrated', 'Adds trace phosphorus'],
    isPublished: true,
    sku: 'KB-NUT-PHDOWN',
    mainImageUrl: 'https://plus.unsplash.com/premium_photo-1678122394541-e945e412d0c2?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'pH Down Bottle', subtitle: '500ml Storage', imageUrl: 'https://plus.unsplash.com/premium_photo-1678122394541-e945e412d0c2?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Active Ingredient', description: 'Phosphoric Acid (H3PO4)' },
      { title: 'Concentration', description: '85% Solution' },
      { title: 'Caution', description: 'Corrosive. Handle with gloves.' }
    ]
  },
  {
    name: 'Liquid pH Up (Potassium Hydroxide)',
    description: 'Safely raise the pH of your nutrient solution if your source water is too acidic or if nutrients drop the pH too low.',
    price: 220,
    originalPrice: null,
    stock: 85,
    category: 'Nutrient',
    warranty: 'ไม่มีรับประกัน',
    features: ['Rapid Adjustment', 'Prevents Nutrient Lockout', 'Adds Potassium'],
    isPublished: true,
    sku: 'KB-NUT-PHUP',
    mainImageUrl: 'https://images.unsplash.com/photo-1616782481977-cb0208fa7563?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'pH Up Bottle', subtitle: '500ml Storage', imageUrl: 'https://images.unsplash.com/photo-1616782481977-cb0208fa7563?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Active Ingredient', description: 'Potassium Hydroxide (KOH)' },
      { title: 'Concentration', description: 'Liquid Substrate' }
    ]
  },
  {
    name: 'Kelp Magic Root Extract (100ml)',
    description: '100% Organic cold-pressed ascetic kelp extract. Contains natural rooting hormones, cytokines, and trace minerals for explosive root growth.',
    price: 550,
    originalPrice: 650,
    stock: 45,
    category: 'Nutrient',
    warranty: 'ไม่มีรับประกัน',
    features: ['Explosive Rooting', 'Cures Transplant Shock', '100% Organic'],
    isPublished: true,
    sku: 'KB-NUT-ROOT',
    mainImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Kelp Extract Dropper', subtitle: '100ml Glass Bottle', imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Source', description: 'Ascophyllum Nodosum (North Atlantic Kelp)' },
      { title: 'Dosage', description: '1-2ml per 10 Liters' }
    ]
  },
  {
    name: 'Cal-Mag Plus Advanced Supplement',
    description: 'Essential Calcium, Magnesium, and Iron supplement. Prevents blossom end rot, leaf tip burn, and overall deficiency when using RO water.',
    price: 390,
    originalPrice: 450,
    stock: 90,
    category: 'Nutrient',
    warranty: 'ไม่มีรับประกัน',
    features: ['Fixes Yellowing Leaves', 'EDTA Chelated Iron', 'Crucial for RO Water'],
    isPublished: true,
    sku: 'KB-NUT-CALMAG',
    mainImageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Cal-Mag Bottle', subtitle: '500ml Concentrate', imageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Calcium (Ca)', description: '3.2%' },
      { title: 'Magnesium (Mg)', description: '1.2%' },
      { title: 'Iron (Fe)', description: '0.1% Chelated' }
    ]
  },

  // ---- HARDWARE (5) ----
  {
    name: 'Samsung LM301H Full Spectrum LED Board (240W)',
    description: 'The pinnacle of indoor LED grow light efficiency. Featuring genuine Samsung LM301H diodes and Osram Deep Red for incredible canopy penetration.',
    price: 7900,
    originalPrice: 9500,
    stock: 25,
    category: 'Hardware',
    warranty: '3 ปี',
    features: ['3.1 µmol/J Efficiency', 'MeanWell Premium Driver', 'Dimmable Knob', 'Zero Noise (Fanless)'],
    isPublished: true,
    sku: 'KB-HW-LED240',
    mainImageUrl: 'https://images.unsplash.com/photo-1563200057-7977a41ecfcb?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'LED Quantum Board', subtitle: 'Dual Panel Heatsink', imageUrl: 'https://images.unsplash.com/photo-1563200057-7977a41ecfcb?q=80&w=400&fit=crop' },
      { title: 'MeanWell Driver', subtitle: 'XLG-240-H', imageUrl: 'https://images.unsplash.com/photo-1584981144415-4ba8d6c70817?q=80&w=400&fit=crop' },
      { title: 'Hanging Kit', subtitle: 'Steel Carabiners & Wires', imageUrl: 'https://images.unsplash.com/photo-1582719202047-76d34324facc?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Diodes', description: 'Samsung LM301H + Osram 660nm Red + 730nm IR' },
      { title: 'Efficacy', description: '3.1 µmol/J' },
      { title: 'Power Draw', description: '240 Watts from Wall' },
      { title: 'Spectrum', description: '3000K + 5000K Full Spectrum' }
    ]
  },
  {
    name: 'SOBO AP-1000 Submersible Water Pump',
    description: 'Extremely reliable completely submersible water pump. Perfect for pushing water up through NFT channel manifolds or circulating nutrient reservoirs.',
    price: 490,
    originalPrice: 650,
    stock: 120,
    category: 'Hardware',
    warranty: '1 ปี',
    features: ['Ultra-Quiet Operation', 'Ceramic Impeller Shaft', 'Low Power Consumption'],
    isPublished: true,
    sku: 'KB-HW-PUMP1K',
    mainImageUrl: 'https://images.unsplash.com/photo-1534017684618-2ba4073fb8eb?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Pump Body', subtitle: 'Submersible Enclosure', imageUrl: 'https://images.unsplash.com/photo-1534017684618-2ba4073fb8eb?q=80&w=400&fit=crop' },
      { title: 'Nozzle Adapters', subtitle: '12mm & 16mm Thread', imageUrl: 'https://images.unsplash.com/photo-1582719202047-76d34324facc?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Max Flow Rate', description: '400 L/Hr' },
      { title: 'Max Head Height (H.Max)', description: '1.2 Meters' },
      { title: 'Power Consumption', description: '8 Watts' }
    ]
  },
  {
    name: 'AC Infinity Cloudline T4 Inline Duct Fan',
    description: 'Smart and quiet ventilation. The Cloudline T4 features a PWM-controlled EC motor and smart thermostat controller for precise exhaust handling.',
    price: 5200,
    originalPrice: 5900,
    stock: 18,
    category: 'Hardware',
    warranty: '2 ปี',
    features: ['Virtually Silent EC Motor', 'Digital Thermostat Controller', '10-Speed PWM'],
    isPublished: true,
    sku: 'KB-HW-INF-T4',
    mainImageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Inline Fan 4"', subtitle: 'Polycarbonate Body', imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=400&fit=crop' },
      { title: 'Smart Controller', subtitle: 'Temp/Humidity Sensor Probe', imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Airflow', description: '205 CFM Max' },
      { title: 'Noise Level', description: '28 dBA at Max Speed' },
      { title: 'Duct Size', description: '4 Inches (100mm)' }
    ]
  },
  {
    name: 'Premium Sponge GroCubes (96 Holes x3)',
    description: 'High porosity sponge material tailored specifically for hydroponic seed germination. Provides optimal moisture retention while maintaining high airflow to roots.',
    price: 180,
    originalPrice: 220,
    stock: 450,
    category: 'Hardware',
    warranty: 'ไม่มีรับประกัน',
    features: ['Pre-sliced T-Slots', 'Zero Mess or Dust', 'Perfect Water/Air Ratio'],
    isPublished: true,
    sku: 'KB-HW-SPONGE-3',
    mainImageUrl: 'https://plus.unsplash.com/premium_photo-1678122394541-e945e412d0c2?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Sponge Sheets', subtitle: '3 Sheets (96 holes each)', imageUrl: 'https://plus.unsplash.com/premium_photo-1678122394541-e945e412d0c2?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Material', description: 'Open-cell Polyurethane' },
      { title: 'Dimensions', description: 'Base 25mm x Height 25mm (Per Cube)' }
    ]
  },
  {
    name: 'Heavy Duty Net Pots 2-Inch (Pack of 100)',
    description: 'Thick, UV-stabilized heavy duty plastic net pots. Wide lip edge allows pots to rest perfectly in PVC pipes or DWC lids without falling through.',
    price: 250,
    originalPrice: 350,
    stock: 200,
    category: 'Hardware',
    warranty: '1 ปี',
    features: ['UV Inhibitor Treated', 'Wide Lip Comfort Design', 'Reusable for Decades'],
    isPublished: true,
    sku: 'KB-HW-NET2IN',
    mainImageUrl: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=800&auto=format&fit=crop',
    includedItems: [
      { title: 'Net Pots', subtitle: '100 Pieces', imageUrl: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=400&fit=crop' }
    ],
    techSpecs: [
      { title: 'Top Diameter', description: '2 Inches (50mm)' },
      { title: 'Height', description: '2.5 Inches (63mm)' },
      { title: 'Material', description: 'BPA-Free Polypropylene' }
    ]
  }
];

const mockUsers = [
  { name: 'สมชาย ใจดี', email: 'somchai@example.com', phone: '0812345678' },
  { name: 'สมหญิง รักดี', email: 'somying@example.com', phone: '0898765432' },
  { name: 'มานะ อดทน', email: 'mana@example.com', phone: '0861112222' },
  { name: 'ปิติ ปรีดา', email: 'piti@example.com', phone: '0833334444' },
  { name: 'ชูใจ ยิ้มแย้ม', email: 'choojai@example.com', phone: '0855556666' },
  { name: 'วีระ กล้าหาญ', email: 'weera@example.com', phone: '0819998888' },
  { name: 'แพรไหม ทองดี', email: 'paemai@example.com', phone: '0821234567' },
  { name: 'ธนา พารวย', email: 'thana@example.com', phone: '0877778888' },
];

const mockProvinces = ['กรุงเทพมหานคร', 'เชียงใหม่', 'ชลบุรี', 'ขอนแก่น', 'ภูเก็ต'];
const mockAddresses = [
  '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย',
  '99/9 ถนนนิมมานเหมินทร์ ตำบลสุเทพ อำเภอเมือง',
  '44/12 ถนนพัทยาทีใต้ ตำบลหนองปรือ อำเภอบางละมุง',
  '55/2 ถนนศรีจันทร์ ตำบลในเมือง อำเภอเมือง',
  '88/8 ถนนถลาง ตำบลตลาดใหญ่ อำเภอเมือง',
];

async function main() {
  console.log('🌱 Cleansing database... removing legacy data.');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();

  console.log('✨ Seeding 20 premium mock hydroponics products...');
  const createdProducts = [];
  for (const productData of mockProducts) {
    const p = await prisma.product.create({
      data: {
        ...productData,
        includedItems: productData.includedItems,
        techSpecs: productData.techSpecs,
      }
    });
    createdProducts.push(p);
    console.log(` • Inserted: ${p.name}`);
  }

  console.log('✨ Seeding mock users, addresses, and orders...');
  for (const [index, userData] of mockUsers.entries()) {
    // Hash password mock
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: 'hashed_password_mock', // Usually you'd hash this
        role: 'USER',
      }
    });

    // Create 1-2 addresses for user
    const addressCount = (index % 2) + 1;
    const userAddresses = [];
    for (let i = 0; i < addressCount; i++) {
      const address = await prisma.address.create({
        data: {
          userId: user.id,
          fullName: user.name,
          phone: user.phone || '0000000000',
          addressLine: mockAddresses[(index + i) % mockAddresses.length],
          province: mockProvinces[(index + i) % mockProvinces.length],
          postalCode: `10${index}${i}0`,
          isDefault: i === 0,
        }
      });
      userAddresses.push(address);
    }

    // Create 1-3 orders for user
    const orderCount = (index % 3) + 1;
    for (let i = 0; i < orderCount; i++) {
      const orderAddress = userAddresses[i % userAddresses.length];
      
      // Select 1-3 random products for the order
      const itemQtyCount = (i % 3) + 1;
      const orderItemsData = [];
      let totalAmount = 0;
      
      for (let j = 0; j < itemQtyCount; j++) {
        const product = createdProducts[(index + i + j) % createdProducts.length];
        const qty = (j % 2) + 1;
        totalAmount += product.price * qty;
        orderItemsData.push({
          productId: product.id,
          quantity: qty,
          priceAtPurchase: product.price,
        });
      }

      await prisma.order.create({
        data: {
          userId: user.id,
          totalAmount,
          status: i === 0 ? 'PENDING' : (i === 1 ? 'SHIPPED' : 'DELIVERED'),
          addressId: orderAddress.id,
          shippingAddressSnapshot: JSON.stringify({
            fullName: orderAddress.fullName,
            phone: orderAddress.phone,
            addressLine: orderAddress.addressLine,
            province: orderAddress.province,
            postalCode: orderAddress.postalCode,
          }),
          trackingNumber: i > 0 ? `TH${Date.now()}88${i}` : null,
          paymentMethod: i % 2 === 0 ? 'Credit Card' : 'Bank Transfer',
          items: {
            create: orderItemsData,
          }
        }
      });
    }
  }

  console.log('✅ Seeding completed beautifully with rich metadata!');
}

main()
  .catch((e) => {
    console.error('Error executing seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
