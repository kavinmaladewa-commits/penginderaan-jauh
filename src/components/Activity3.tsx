import React from 'react';
import {
  Search,
  MapPin,
  Trees,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { Activity3Data } from '../types/lkpd';
import { DETECTIVE_OBJECTS, OBJECT_OPTIONS } from '../constants/lkpdData';

interface Activity3Props {
  data: Activity3Data;
  onChange: (newData: Activity3Data) => void;
  onSave: () => void;
  onNext: () => void;
  onBack: () => void;
  isReadOnly?: boolean;
}

export const Activity3: React.FC<Activity3Props> = ({
  data,
  onChange,
  onSave,
  onNext,
  onBack,
  isReadOnly = false,
}) => {
  const handleObjectChange = (
    key: 'objekA' | 'objekB' | 'objekC' | 'objekD',
    val: string
  ) => {
    if (isReadOnly) return;
    onChange({
      ...data,
      identifications: {
        ...data.identifications,
        [key]: val,
      },
    });
  };

  const handleCaseStudy = (field: 'question1' | 'question2', val: string) => {
    if (isReadOnly) return;
    onChange({
      ...data,
      caseStudy: {
        ...data.caseStudy,
        [field]: val,
      },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-2xl shadow-xs">
            🔎
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              Aktivitas 3
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Detektif Citra & Manfaat Penginderaan Jauh
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Lakukan interpretasi bentang alam permukaan bumi dan telaah studi kasus pemanfaatan citra.
            </p>
          </div>
        </div>

        {isReadOnly && (
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold">
            🔒 Mode Baca (Jawaban Terkunci)
          </span>
        )}
      </div>

      {/* Bagian 1: Detektif Citra Visual */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md space-y-6">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs">
            1
          </span>
          <h3>Interpretasi Visual Citra Satelit</h3>
        </div>

        <p className="text-xs text-slate-600">
          Perhatikan simulasi rekaman citra satelit permukaan bumi berikut dengan 4 pin objek (A, B, C, D). Analisis unsur interpretasi citra (rona, pola, bentuk, tekstur, situs/asosiasi) untuk mengidentifikasi nama objek!
        </p>

        {/* Visual Map / Satellite Scene Graphic */}
        <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-900 overflow-hidden border-2 border-slate-700 shadow-inner">
          {/* Top metadata overlay */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-sky-300 font-mono">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>KOMPOSIT MULTISPEKTRAL RGB (B4-B3-B2) • SKALA 1:25.000</span>
          </div>

          <div className="absolute top-3 right-3 z-20 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-slate-300 font-mono border border-slate-700">
            N: 07°15&apos;30&quot; S | E: 110°22&apos;14&quot; E
          </div>

          {/* SVG Map Landscape Representation */}
          <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
            {/* Background base landscape */}
            <rect width="800" height="400" fill="#2d4a22" />

            {/* Object A: Sawah (Paddy Fields) - Grid polygons of varying greens */}
            <g opacity="0.9">
              {Array.from({ length: 6 }).map((_, r) =>
                Array.from({ length: 5 }).map((_, c) => (
                  <rect
                    key={`paddy-${r}-${c}`}
                    x={20 + c * 52}
                    y={30 + r * 50}
                    width={48}
                    height={46}
                    fill={((r + c) % 2 === 0 ? '#4ade80' : '#22c55e')}
                    stroke="#15803d"
                    strokeWidth="1.5"
                  />
                ))
              )}
            </g>

            {/* Object B: Sungai (Meandering River) - Curved dark blue ribbon */}
            <path
              d="M 320 0 Q 360 80 430 140 T 470 260 T 560 330 T 630 400"
              fill="none"
              stroke="#0f172a"
              strokeWidth="32"
              strokeLinecap="round"
            />
            <path
              d="M 320 0 Q 360 80 430 140 T 470 260 T 560 330 T 630 400"
              fill="none"
              stroke="#0284c7"
              strokeWidth="24"
              strokeLinecap="round"
            />

            {/* Object C: Jalan Raya (Roads) - Sharp light gray straight intersecting paths */}
            <line x1="0" y1="210" x2="800" y2="210" stroke="#f8fafc" strokeWidth="8" />
            <line x1="0" y1="210" x2="800" y2="210" stroke="#94a3b8" strokeWidth="6" strokeDasharray="12,4" />
            <line x1="560" y1="0" x2="560" y2="400" stroke="#cbd5e1" strokeWidth="7" />

            {/* Object D: Permukiman (Settlement / Residential roofs) */}
            <g>
              {Array.from({ length: 7 }).map((_, i) =>
                Array.from({ length: 4 }).map((_, j) => (
                  <rect
                    key={`roof-${i}-${j}`}
                    x={610 + j * 38}
                    y={70 + i * 36}
                    width={28}
                    height={24}
                    fill={((i * 3 + j) % 3 === 0 ? '#ea580c' : '#b45309')}
                    stroke="#78350f"
                    strokeWidth="1"
                  />
                ))
              )}
            </g>

            {/* Coordinate Grid overlay lines */}
            <line x1="200" y1="0" x2="200" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4,4" />
            <line x1="400" y1="0" x2="400" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4,4" />
            <line x1="600" y1="0" x2="600" y2="400" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4,4" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4,4" />
            <line x1="0" y1="300" x2="800" y2="300" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4,4" />
          </svg>

          {/* Interactive Object Pins */}
          {/* Pin A: Sawah */}
          <div className="absolute top-28 left-28 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
            <div className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs shadow-lg ring-4 ring-white/50 animate-bounce">
              📍 Objek A
            </div>
            <div className="w-2 h-2 bg-emerald-600 rotate-45 -mt-1" />
          </div>

          {/* Pin B: Sungai */}
          <div className="absolute top-44 left-[53%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
            <div className="px-2.5 py-1 rounded-full bg-sky-600 text-white font-extrabold text-xs shadow-lg ring-4 ring-white/50 animate-bounce" style={{ animationDelay: '0.2s' }}>
              📍 Objek B
            </div>
            <div className="w-2 h-2 bg-sky-600 rotate-45 -mt-1" />
          </div>

          {/* Pin C: Jalan */}
          <div className="absolute bottom-28 left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
            <div className="px-2.5 py-1 rounded-full bg-slate-800 text-white font-extrabold text-xs shadow-lg ring-4 ring-white/50 animate-bounce" style={{ animationDelay: '0.4s' }}>
              📍 Objek C
            </div>
            <div className="w-2 h-2 bg-slate-800 rotate-45 -mt-1" />
          </div>

          {/* Pin D: Permukiman */}
          <div className="absolute top-28 right-24 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
            <div className="px-2.5 py-1 rounded-full bg-orange-600 text-white font-extrabold text-xs shadow-lg ring-4 ring-white/50 animate-bounce" style={{ animationDelay: '0.6s' }}>
              📍 Objek D
            </div>
            <div className="w-2 h-2 bg-orange-600 rotate-45 -mt-1" />
          </div>
        </div>

        {/* 4 Object Identification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {DETECTIVE_OBJECTS.map((obj) => {
            const key = obj.id as 'objekA' | 'objekB' | 'objekC' | 'objekD';
            const currentAnswer = data.identifications[key];

            return (
              <div
                key={obj.id}
                className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      {obj.label}
                    </span>
                    {currentAnswer && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terpilih: {currentAnswer}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 mb-3">
                    <p className="font-bold text-slate-800 mb-1">Ciri-Ciri Interpretasi:</p>
                    {obj.characteristics.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-sky-500 font-bold">•</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Identifikasi Objek:
                  </label>
                  <select
                    disabled={isReadOnly}
                    value={currentAnswer}
                    onChange={(e) => handleObjectChange(key, e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden disabled:bg-slate-100"
                  >
                    <option value="">-- Pilih Nama Objek --</option>
                    {OBJECT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian 2: Studi Kasus Manfaat */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md space-y-5">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
            2
          </span>
          <h3>Studi Kasus: Pemanfaatan Penginderaan Jauh</h3>
        </div>

        <div className="p-4 sm:p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
            <Trees className="w-4 h-4 text-emerald-700" />
            <span>Kasus Pemantauan Hutan</span>
          </div>
          <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed">
            &ldquo;Pemerintah ingin mengetahui perubahan luas tutupan hutan akibat pembukaan lahan di berbagai pulau besar Indonesia.&rdquo;
          </p>
        </div>

        {/* Pertanyaan 1 */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            Pertanyaan 1: Mengapa teknologi penginderaan jauh sangat cocok digunakan dalam kasus pemantauan perubahan hutan tersebut?
          </label>
          <textarea
            disabled={isReadOnly}
            rows={3}
            value={data.caseStudy.question1}
            onChange={(e) => handleCaseStudy('question1', e.target.value)}
            placeholder=""
            className="w-full p-3.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-slate-100"
          />
        </div>

        {/* Pertanyaan 2 */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            Pertanyaan 2: Siapa sajakah pihak yang dapat menggunakan data citra tersebut dan apa kegunaannya bagi mereka?
          </label>
          <textarea
            disabled={isReadOnly}
            rows={3}
            value={data.caseStudy.question2}
            onChange={(e) => handleCaseStudy('question2', e.target.value)}
            placeholder=""
            className="w-full p-3.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-slate-100"
          />
        </div>

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
            Tuliskan analisis atau opini kritis kelompokmu mengenai peran citra penginderaan jauh dalam pelestarian lingkungan bumi secara mandiri:
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
            className="w-full p-3.5 rounded-xl border border-amber-300 bg-amber-50/20 focus:bg-white text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all disabled:bg-slate-100"
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
          <span>Kembali ke Aktivitas 2</span>
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
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Lanjut ke Refleksi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
