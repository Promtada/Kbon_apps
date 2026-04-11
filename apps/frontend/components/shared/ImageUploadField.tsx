'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import { API_BASE } from '../../lib/axios';

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUploadField({ value, onChange, className = '' }: ImageUploadFieldProps) {
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
      onChange(data.url);
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
      console.error(error);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div 
      className={`relative flex-shrink-0 w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden group transition-all hover:border-[#22C55E]/50 hover:bg-[#22C55E]/5 cursor-pointer flex flex-col items-center justify-center ${className}`}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      {value ? (
        <>
          <img src={value} alt="Uploaded Item" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isUploading ? (
              <Loader2 size={16} className="animate-spin text-[#22C55E]" />
            ) : (
              <UploadCloud size={16} className="text-white" />
            )}
          </div>
        </>
      ) : (
        <>
           {isUploading ? (
              <Loader2 size={20} className="animate-spin text-[#22C55E]" />
           ) : (
              <div className="text-slate-400 group-hover:text-[#22C55E] flex flex-col items-center gap-1 transition-colors">
                 <ImageIcon size={20} />
                 <span className="text-[9px] font-bold uppercase tracking-widest">Image</span>
              </div>
           )}
        </>
      )}

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
