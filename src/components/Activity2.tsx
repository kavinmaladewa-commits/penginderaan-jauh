import React from 'react';
import { Radio, ArrowRight, ArrowLeft, Save, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Activity2Case } from '../types/lkpd';

interface Activity2Props {
  cases: Activity2Case[];
  onChange: (cases: Activity2Case[]) => void;
  onSave: () => void;
  onNext: () => void;
  onBack: () => void;
  isReadOnly?: boolean;
}

export const Activity2: React.FC<Activity2Props> = ({
  cases,
  onChange,
  onSave,
  onNext,
  onBack,
  isReadOnly = false,
}) => {
  const handleChoice = (id: number, choice: 'Aktif' | 'Pasif') => {
    if (isReadOnly) return;
    const updated = cases.map((c) => (c.id === id ? { ...c, choice } : c));
    onChange(updated);
  };

  const handleReason = (id: number, reason: string) => {
    if (isReadOnly) return;
    const updated = cases.map((c) => (c.id === id ? { ...c, reason } : c));
    onChange(updated);
  };

  const answeredCount = cases.filter((c) => c.choice && c.reason.trim().length > 0).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-2xl shadow-xs">
            📡
          </div>
          <div>
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
              Aktivitas 2
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Aktif atau Pasif?
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifikasi tipe sistem penginderaan jauh pada 6 kasus berikut dan sertakan alasan ilmiahnya.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold">
            {answeredCount} / 6 Kasus Terjawab
          </span>
          {isReadOnly && (
            <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold">
              🔒 Terkunci
            </span>
          )}
        </div>
      </div>

      {/* Brief guide */}
      <div className="p-4 bg-gradient-to-r from-teal-50 to-sky-50 rounded-2xl border border-teal-200 text-xs text-slate-700 space-y-1">
        <p className="font-bold text-teal-900">💡 Pengingat Konsep:</p>
        <p>• <strong>Sistem Pasif:</strong> Menggunakan sumber tenaga alami (seperti sinar matahari). Perekaman sangat bergantung pada siang hari dan cuaca cerah.</p>
        <p>• <strong>Sistem Aktif:</strong> Menggunakan sumber tenaga buatan yang dipancarkan sendiri oleh sensor (seperti gelombang mikro radar/pulsa LiDAR). Dapat bekerja siang maupun malam hari.</p>
      </div>

      {/* 6 Cases */}
      <div className="grid grid-cols-1 gap-6">
        {cases.map((item, index) => {
          const isDone = item.choice && item.reason.trim().length > 0;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all ${
                isDone
                  ? 'border-teal-200 shadow-md ring-1 ring-teal-100'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              {/* Case Number & Scenario */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                      Kasus {index + 1}
                    </h3>
                    <p className="text-sm sm:text-base font-semibold text-slate-900 mt-1">
                      {item.scenario}
                    </p>
                  </div>
                </div>

                {isDone && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4" /> Lengkap
                  </span>
                )}
              </div>

              {/* Radio options: Aktif vs Pasif */}
              <div className="grid grid-cols-2 gap-3 mb-4 max-w-md">
                <button
                  type="button"
                  disabled={isReadOnly}
                  onClick={() => handleChoice(item.id, 'Aktif')}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    item.choice === 'Aktif'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-lg">⚡</span>
                  <span>Sistem Aktif</span>
                </button>

                <button
                  type="button"
                  disabled={isReadOnly}
                  onClick={() => handleChoice(item.id, 'Pasif')}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    item.choice === 'Pasif'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20 scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-lg">☀️</span>
                  <span>Sistem Pasif</span>
                </button>
              </div>

              {/* Essay Reason Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alasan Kelompok: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  disabled={isReadOnly}
                  rows={2}
                  value={item.reason}
                  onChange={(e) => handleReason(item.id, e.target.value)}
                  placeholder=""
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all disabled:bg-slate-100"
                />
              </div>

            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Aktivitas 1</span>
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
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-bold text-sm shadow-md shadow-teal-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Lanjut ke Aktivitas 3: Detektif Citra</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
