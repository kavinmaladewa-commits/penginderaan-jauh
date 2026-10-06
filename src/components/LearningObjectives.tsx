import React from 'react';
import { Target, Lightbulb, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { SYSTEM_COMPONENTS } from '../constants/lkpdData';

interface LearningObjectivesProps {
  onContinue: () => void;
}

export const LearningObjectives: React.FC<LearningObjectivesProps> = ({ onContinue }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Card 1: Tujuan Pembelajaran */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-2xl shadow-xs">
            🎯
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              Capaian Pembelajaran
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Tujuan Pembelajaran
            </h2>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          Setelah mengikuti kegiatan LKPD Digital ini, peserta didik diharapkan mampu:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {[
            '1. Menyebutkan konsep dasar penginderaan jauh.',
            '2. Menjelaskan fungsi komponen utama sistem penginderaan jauh.',
            '3. Menyusun urutan proses sistem penginderaan jauh dengan benar.',
            '4. Membedakan sistem penginderaan jauh aktif dan pasif.',
            '5. Menjelaskan manfaat penginderaan jauh dalam kehidupan.',
          ].map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                index === 4
                  ? 'md:col-span-2 bg-gradient-to-r from-sky-50/70 to-emerald-50/70 border-sky-200'
                  : 'bg-white border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-snug">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Materi Singkat (Ingat Kembali!) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-2xl shadow-xs">
            💡
          </div>
          <div>
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase">
              Materi Pengantar
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Ingat Kembali!
            </h2>
          </div>
        </div>

        {/* Definition */}
        <div className="p-4 sm:p-5 bg-sky-50/80 rounded-2xl border border-sky-200 mb-6">
          <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
            <span className="font-bold text-sky-900">Penginderaan jauh</span> adalah teknik memperoleh informasi mengenai objek, wilayah, atau fenomena tanpa kontak langsung menggunakan sensor.
          </p>
        </div>

        {/* Diagram Alur */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Alur Sistem Penginderaan Jauh:
          </h3>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 items-center text-center">
              {SYSTEM_COMPONENTS.map((comp, idx) => (
                <React.Fragment key={comp.id}>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">{comp.icon}</span>
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {comp.name}
                    </span>
                  </div>
                  {idx < SYSTEM_COMPONENTS.length - 1 && (
                    <div className="hidden lg:flex justify-center text-sky-400 font-bold text-sm">
                      ➔
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Component Descriptions */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Penjelasan Singkat Komponen:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SYSTEM_COMPONENTS.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 flex items-start gap-3"
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Continue Action */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onContinue}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-bold text-base shadow-lg shadow-sky-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Lanjut ke Aktivitas 1: Susun Sistem</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
