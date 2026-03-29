'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:4000/api/auth/register', {
        name,
        email,
        password,
      });

      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      router.push('/login'); // สมัครเสร็จให้ไปหน้า Login
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-black">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-xl border border-gray-100">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create Account</h2>
        <p className="text-center text-gray-500">สมัครสมาชิกเพื่อเริ่มต้นใช้งาน Kbon</p>

        {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">{error}</div>}

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-green-500 border-gray-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-green-500 border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-green-500 border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full rounded-lg p-3 font-semibold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}