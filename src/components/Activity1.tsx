import React, { useState } from 'react';
import {
  Satellite,
  Clock,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  HelpCircle,
  Save,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Activity1Data } from '../types/lkpd';
import { SYSTEM_COMPONENTS, EXAMPLE_OPTIONS } from '../constants/lkpdData';

interface Activity1Props {
  data: Activity1Data;
  onChange: (newData: Activity1Data) => void;
  onSave: () => void;
  onNext: () => void;
  isReadOnly?: boolean;
}

export const Activity1: React.FC<Activity1Props> = ({
  data,
  onChange,
  onSave,
  onNext,
  isReadOnly = false,
}) => {
  const [orderSavedToast, setOrderSavedToast] = useState(false);

  // Re-ordering cards logic
  const moveItem = (fromIndex: number, toIndex: number) => {
    if (isReadOnly) return;
    if (toIndex < 0 || toIndex >= data.componentOrder.length) return;
    const newOrder = [...data.componentOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    onChange({
      ...data,
      componentOrder: newOrder,
    });
  };

  const handleSaveOrder = () => {
    onSave();
    setOrderSavedToast(true);
    setTimeout(() => setOrderSavedToast(false), 2500);
  };

  const handleExampleMatchChange = (componentName: string, exampleValue: string) => {
    if (isReadOnly) return;
    onChange({
      ...data,
      exampleMatches: {
        ...data.exampleMatches,
        [componentName]: exampleValue,
      },
    });
  };

  const handleTableChange = (
    componentName: string,
    field: 'fungsi' | 'contoh',
    value: string
  ) => {
    if (isReadOnly) return;
    onChange({
      ...data,
      componentTable: {
        ...data.componentTable,
        [componentName]: {
          ...(data.componentTable[componentName] || { fungsi: '', contoh: '' }),
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-2xl shadow-xs">
            🛰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-700 tracking-wider uppercase">
                Aktivitas 1
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" /> Alokasi: 25 Menit
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Susun Sistem Penginderaan Jauh
            </h2>
          </div>
        </div>

        {isReadOnly && (
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold">
            🔒 Mode Baca (Jawaban Terkunci)
          </span>
        )}
      </div>

      {/* Bagian 1: Studi Kasus */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs">
            1
          </span>
          <h3>Studi Kasus Wilayah Indonesia</h3>
        </div>

        <div className="p-4 sm:p-5 bg-sky-50/80 rounded-2xl border border-sky-200">
          <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed">
            &ldquo;Indonesia memiliki wilayah yang luas. Ketika terjadi banjir atau kebakaran hutan, pemerintah membutuhkan informasi wilayah terdampak secara cepat. Namun tidak semua lokasi dapat didatangi langsung.&rdquo;
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Pertanyaan: Bagaimana teknologi dapat membantu memperoleh informasi wilayah tersebut?
          </label>
          <textarea
            disabled={isReadOnly}
            rows={4}
            value={data.caseStudyAnswer}
            onChange={(e) =>
              onChange({
                ...data,
                caseStudyAnswer: e.target.value,
              })
            }
            placeholder=""
            className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50/30 focus:bg-white text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all disabled:opacity-75 disabled:bg-slate-100"
          />
        </div>

        {/* Kolom Esai Pemahaman Mandiri Tanpa Clue/Petunjuk */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
              Esai Mandiri
            </span>
            <label className="block text-sm font-bold text-slate-800">
              Kolom Jawaban Esai Pemahaman Kelompok (Dibuat Kosong Tanpa Petunjuk):
            </label>
          </div>
          <p className="text-xs text-slate-500 mb-2">
            Tuliskan pemikiran dan analisis kelompok mengenai alur kerja sistem penginderaan jauh secara murni berdasarkan pemahaman kalian sendiri:
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
            className="w-full p-4 rounded-xl border border-amber-300 bg-amber-50/20 focus:bg-white text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all disabled:opacity-75 disabled:bg-slate-100"
          />
        </div>
      </div>

      {/* Bagian 2: Urutkan Alur Sistem (Interactive Re-ordering) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs">
              2
            </span>
            <h3>Urutkan 7 Komponen Sistem Penginderaan Jauh</h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Gunakan tombol panah untuk menyusun urutan yang tepat
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Susun kartu komponen berikut dari tahap awal (sumber tenaga) hingga informasi sampai ke tangan pihak yang membutuhkan.
        </p>

        {/* Cards list */}
        <div className="space-y-2.5">
          {data.componentOrder.map((componentName, idx) => {
            const matchedInfo = SYSTEM_COMPONENTS.find((c) => c.name === componentName);
            return (
              <div
                key={componentName}
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-sky-50/40 rounded-2xl border border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-sky-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {idx + 1}
                  </div>
                  <span className="text-xl">{matchedInfo?.icon || '🔹'}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{componentName}</h4>
                    <p className="text-[11px] text-slate-500 hidden sm:block">
                      {matchedInfo?.desc}
                    </p>
                  </div>
                </div>

                {!isReadOnly && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, idx - 1)}
                      className="p-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-600 disabled:opacity-30 disabled:pointer-events-none hover:text-sky-700 transition-colors"
                      title="Geser ke Atas"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.componentOrder.length - 1}
                      onClick={() => moveItem(idx, idx + 1)}
                      className="p-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-600 disabled:opacity-30 disabled:pointer-events-none hover:text-sky-700 transition-colors"
                      title="Geser ke Bawah"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save Order Button */}
        {!isReadOnly && (
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleSaveOrder}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>SIMPAN URUTAN</span>
            </button>

            {orderSavedToast && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                <CheckCircle className="w-4 h-4" /> Urutan berhasil disimpan!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bagian 3: Pasangkan Contoh Nyata */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs">
            3
          </span>
          <h3>Pasangkan Komponen dengan Contoh Nyata</h3>
        </div>

        <p className="text-xs text-slate-600">
          Pilih contoh nyata yang paling tepat untuk masing-masing komponen sistem penginderaan jauh:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SYSTEM_COMPONENTS.map((comp) => {
            const selectedVal = data.exampleMatches[comp.name] || '';
            return (
              <div
                key={comp.id}
                className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{comp.icon}</span>
                  <span className="text-xs font-bold text-slate-800">{comp.name}</span>
                </div>

                <select
                  disabled={isReadOnly}
                  value={selectedVal}
                  onChange={(e) => handleExampleMatchChange(comp.name, e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden disabled:bg-slate-100"
                >
                  <option value="">-- Pilih Contoh Nyata --</option>
                  {EXAMPLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian 4: Tabel Komponen (Esai Fungsi & Contoh) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs">
            4
          </span>
          <h3>Tabel Komponen Sistem Penginderaan Jauh</h3>
        </div>

        {/* Notice: Pure Essay, No Keyword Matching */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
          <span className="font-bold">📝 Catatan Pengerjaan:</span> Bagian fungsi dan contoh merupakan jawaban esai kelompok. Tuliskan penjelasan dengan bahasa kelompokmu sendiri secara lengkap. Penilaian akan dilakukan langsung oleh Guru.
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-sky-50 border-b border-sky-100 text-slate-700">
                <th className="p-3 font-bold w-12 text-center">No</th>
                <th className="p-3 font-bold w-40">Komponen</th>
                <th className="p-3 font-bold min-w-[240px]">Fungsi (Esai)</th>
                <th className="p-3 font-bold min-w-[200px]">Contoh Lain (Esai)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SYSTEM_COMPONENTS.map((comp, idx) => {
                const row = data.componentTable[comp.name] || { fungsi: '', contoh: '' };
                return (
                  <tr key={comp.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-center text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{comp.icon}</span>
                        <span>{comp.name}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <textarea
                        disabled={isReadOnly}
                        rows={2}
                        value={row.fungsi}
                        onChange={(e) => handleTableChange(comp.name, 'fungsi', e.target.value)}
                        placeholder=""
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-sky-500 focus:outline-hidden disabled:bg-slate-100"
                      />
                    </td>
                    <td className="p-2">
                      <textarea
                        disabled={isReadOnly}
                        rows={2}
                        value={row.contoh}
                        onChange={(e) => handleTableChange(comp.name, 'contoh', e.target.value)}
                        placeholder=""
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-sky-500 focus:outline-hidden disabled:bg-slate-100"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
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
          className="w-full sm:w-auto ml-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-bold text-sm shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Lanjut ke Aktivitas 2: Aktif atau Pasif?</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
