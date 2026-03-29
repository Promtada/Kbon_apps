'use client';
// แก้ไขจุดนี้: เปลี่ยนจาก ../ เป็น ./ เพราะ components อยู่ระดับเดียวกับ page.tsx
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function LandingPage() {
  const combos = [
    { name: 'PH AUTOMATION', price: '$50 Off' },
    { name: 'STARTER COMBO', price: '$75 Off' },
    { name: 'PRO COMBO', price: '$50 Off' },
    { name: 'EXPERT COMBO', price: '$50 Off' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-black font-sans">
      <Navbar />

      {/* --- Main Content --- */}
      <main className="flex-grow">
        <section className="text-center py-20 px-4">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            The Best Automated <br /> 
            <span className="text-green-600 font-black">Hydroponics System</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-12">
            Save Time with Kbon: Automatic pH Balance and Nutrient Dosing. <br />
            Control from anywhere with the Kbon App.
          </p>
          
          <h2 className="text-2xl font-bold uppercase tracking-widest mt-16 mb-8 text-gray-800">
            Automation Combos
          </h2>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 mb-20">
            {combos.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition">
                <div className="bg-green-600 text-white text-xs font-bold py-1 px-3 w-max rounded-br-lg">
                  {item.price}
                </div>
                <div className="p-6">
                  {/* กรอบรูปจำลอง */}
                  <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                    Product Image
                  </div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}