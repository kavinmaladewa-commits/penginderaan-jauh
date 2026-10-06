import React, { useState } from 'react';
import {
  Send,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExitTicketData } from '../types/lkpd';

interface ExitTicketProps {
  data: ExitTicketData;
  onChange: (newData: ExitTicketData) => void;
  onSave: () => void;
  onSubmitFinal: () => Promise<void>;
  onNextToFinish: () => void;
  onBack: () => void;
  isReadOnly?: boolean;
}

export const ExitTicketSection: React.FC<ExitTicketProps> = ({
  data,
  onChange,
  onSave,
  onSubmitFinal,
  onNextToFinish,
  onBack,
  isReadOnly = false,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ExitTicketData, value: string) => {
    if (isReadOnly) return;
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitFinal();
      setShowConfirmModal(false);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // fallback if canvas not available
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const questions: { key: keyof ExitTicketData; num: number; prompt: string; placeholder: string }[] = [
    {
      key: 'q1',
      num: 1,
      prompt: '1. Penginderaan jauh memperoleh informasi tanpa melakukan ....',
      placeholder: '',
    },
    {
      key: 'q2',
      num: 2,
      prompt: '2. Sensor berfungsi untuk ....',
      placeholder: '',
    },
    {
      key: 'q3',
      num: 3,
      prompt: '3. Drone dan pesawat terbang termasuk dalam komponen ....',
      placeholder: '',
    },
    {
      key: 'q4',
      num: 4,
      prompt: '4. Sumber energi utama pada sistem penginderaan jauh pasif adalah ....',
      placeholder: '',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl shadow-xs">
            🎫
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
              Bagian Akhir
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Exit Ticket Pembelajaran
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Jawab 4 pertanyaan singkat berikut sebelum mengumpulkan hasil pengerjaan LKPD.
            </p>
          </div>
        </div>

        {isReadOnly && (
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold">
            🔒 Mode Baca (Jawaban Terkunci)
          </span>
        )}
      </div>

      {/* 4 Exit Ticket Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md space-y-5">
        {questions.map((q) => (
          <div key={q.key} className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              {q.prompt}
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={data[q.key]}
              onChange={(e) => handleChange(q.key, e.target.value)}
              placeholder={q.placeholder}
              className="w-full p-3.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-slate-100"
            />
          </div>
        ))}
      </div>

      {/* Navigation & Submit Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Refleksi</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {!isReadOnly && (
            <button
              type="button"
              onClick={onSave}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Simpan Draf</span>
            </button>
          )}

          {!isReadOnly ? (
            <>
              <button
                type="button"
                onClick={onNextToFinish}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Lanjut ke Tab Selesai (Ringkasan)</span>
                <span className="text-base">➔</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>KIRIM EXIT TICKET & KUMPULKAN</span>
              </button>
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>LKPD Sudah Dikumpulkan ke Guru</span>
              </div>
              <button
                type="button"
                onClick={onNextToFinish}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <span>Lihat Tab Selesai & Hasil</span>
                <span className="text-sm">➔</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-sky-100 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-emerald-600" />
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
              Kumpulkan Jawaban LKPD?
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              Pastikan kelompokmu sudah memeriksa seluruh jawaban dari Aktivitas 1, 2, 3, Refleksi, hingga Exit Ticket.
              <br /><br />
              <span className="font-semibold text-slate-800">
                Setelah mengumpulkan, jawaban akan otomatis tersimpan di database dan terkunci hingga dinilai oleh Guru.
              </span>
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Periksa Kembali
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Mengirim Jawaban...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Ya, Kumpulkan Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
