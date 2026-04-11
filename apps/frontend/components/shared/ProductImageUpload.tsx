'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { API_BASE } from '../../lib/axios';

interface ProductImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ProductImageUpload({ value, onChange }: ProductImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('ขนาดไฟล์ต้องไม่เกิน 50MB');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/uploads/media`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('อัปโหลดไม่สำเร็จ');

      const data = await res.json();
      onChange(data.url); // Send new URL back to parent form
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
      console.error(error);
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input so same file can be uploaded again if needed
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden group transition-colors hover:border-[#22C55E]/30 hover:bg-[#22C55E]/5 shadow-inner">
        
        {value ? (
          <>
            <img src={value} alt="Product Preview" className="w-full h-full object-cover" />
            
            {/* Hover Overlay */}
            <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              {isUploading ? (
                <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-[#22C55E]" />
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-slate-800 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={16} /> เปลี่ยนรูปภาพ
                </button>
              )}
            </div>
          </>
        ) : (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center cursor-pointer"
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 size={32} className="animate-spin text-[#22C55E] mb-2" />
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} className="text-[#22C55E]" />
                </div>
                <p className="font-bold text-sm text-slate-600 mb-1">อัปโหลดรูปภาพหลัก</p>
                <p className="text-[10px] uppercase tracking-widest mt-1 font-bold opacity-50">PNG, JPG (Max 5MB)</p>
              </>
            )}
          </div>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileUpload} 
      />
    </div>
  );
}
