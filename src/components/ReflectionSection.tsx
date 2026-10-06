import React from 'react';
import { BookOpenCheck, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import { ReflectionData } from '../types/lkpd';

interface ReflectionProps {
  data: ReflectionData;
  onChange: (newData: ReflectionData) => void;
  onSave: () => void;
  onNext: () => void;
  onBack: () => void;
  isReadOnly?: boolean;
}

export const ReflectionSection: React.FC<ReflectionProps> = ({
  data,
  onChange,
  onSave,
  onNext,
  onBack,
  isReadOnly = false,
}) => {
  const handleChange = (field: keyof ReflectionData, value: string) => {
    if (isReadOnly) return;
    onChange({
      ...data,
      [field]: value,
    });
  };

  const questions: { key: keyof ReflectionData; number: number; label: string; placeholder: string }[] = [
    {
      key: 'q1',
      number: 1,
      label: '1. Jelaskan dengan bahasamu sendiri apa konsep dasar penginderaan jauh.',
      placeholder: '',
    },
    {
      key: 'q2',
      number: 2,
      label: '2. Apa fungsi komponen utama penginderaan jauh dalam satu kesatuan sistem?',
      placeholder: '',
    },
    {
      key: 'q3',
      number: 3,
      label: '3. Apa perbedaan sistem aktif dan pasif?',
      placeholder: '',
    },
    {
      key: 'q4',
      number: 4,
      label: '4. Apa manfaat penginderaan jauh dalam kehidupan nyata (kebencanaan, tata ruang, lingkungan)?',
      placeholder: '',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-2xl shadow-xs">
            💬
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">
              Refleksi Pembelajaran
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Refleksi Pemahaman Kelompok
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Diskusikan bersama kelompok dan ungkapkan pemahamanmu menggunakan bahasa sendiri.
            </p>
          </div>
        </div>

        {isReadOnly && (
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold">
            🔒 Mode Baca (Jawaban Terkunci)
          </span>
        )}
      </div>

      {/* 4 Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md space-y-6">
        {questions.map((q) => (
          <div key={q.key} className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              {q.label}
            </label>
            <textarea
              disabled={isReadOnly}
              rows={3}
              value={data[q.key]}
              onChange={(e) => handleChange(q.key, e.target.value)}
              placeholder=""
              className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:bg-slate-100"
            />
          </div>
        ))}

        {/* Kolom Jawaban Esai Pemahaman Mandiri Tanpa Petunjuk */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
              Esai Mandiri
            </span>
            <label className="block text-sm font-bold text-slate-800">
              Kolom Jawaban Esai Pemahaman Mandiri Kelompok (Dibuat Kosong Tanpa Petunjuk):
            </label>
          </div>
          <p className="text-xs text-slate-500 mb-2">
            Tuliskan kesimpulan menyeluruh dan esai refleksi kelompokmu mengenai materi penginderaan jauh secara bebas dan mandiri:
          </p>
          <textarea
            disabled={isReadOnly}
            rows={4}
            value={data.independentEssay || ''}
            onChange={(e) =>
              onChange({
                ...data,
                independentEssay: e.target.value,
              })
            }
            placeholder=""
            className="w-full p-4 rounded-xl border border-amber-300 bg-amber-50/20 focus:bg-white text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all disabled:bg-slate-100"
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Aktivitas 3</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isReadOnly && (
            <button
              type="button"
              onClick={onSave}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Simpan Perubahan</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-700 hover:from-indigo-700 hover:to-sky-800 text-white font-bold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Lanjut ke Exit Ticket</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
