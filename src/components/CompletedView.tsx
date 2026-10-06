import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  MessageSquare,
  Lock,
  Unlock,
  Eye,
  Edit3,
  Calendar,
  Users,
  ChevronRight,
  Send,
  Sparkles,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubmissionDoc } from '../types/lkpd';

interface CompletedViewProps {
  submission: SubmissionDoc;
  onEditRequest: () => void;
  onReviewSection: (stepNumber: number) => void;
  onSubmitFinal?: () => Promise<void>;
}

export const CompletedView: React.FC<CompletedViewProps> = ({
  submission,
  onEditRequest,
  onReviewSection,
  onSubmitFinal,
}) => {
  const isSubmitted =
    submission.status === 'sudah_mengumpulkan' || submission.status === 'sudah_dinilai';
  const isGraded = submission.status === 'sudah_dinilai' && submission.score;
  const isUnlockedByTeacher = submission.status === 'sedang_mengerjakan';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const handleFinalSubmit = async () => {
    if (!onSubmitFinal) return;
    setIsSubmitting(true);
    try {
      await onSubmitFinal();
      setShowConfirmModal(false);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // canvas fallback
      }
    } catch (err) {
      console.error('Final submit failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Completion stats for pre-submission checklist
  const act1CaseFilled = Boolean(submission.activity1?.caseStudyAnswer?.trim());
  const act1TableCount = Object.values(submission.activity1?.componentTable || {}).filter(
    (v) => v.fungsi.trim() || v.contoh.trim()
  ).length;
  const act2AnsweredCount = (submission.activity2?.cases || []).filter(
    (c) => c.choice && c.reason.trim()
  ).length;
  const act3DetCount = Object.values(submission.activity3?.identifications || {}).filter(Boolean).length;
  const act3CaseFilled = Boolean(submission.activity3?.caseStudy?.question1?.trim());
  const refCount = Object.values(submission.reflection || {}).filter((v) => v.trim()).length;
  const exitCount = Object.values(submission.exitTicket || {}).filter((v) => v.trim()).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      
      {/* 1. Header Banner */}
      {isSubmitted ? (
        <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-sky-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Status: Jawaban Berhasil Terkirim ke Guru</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
              Terima Kasih, {submission.groupName}!
            </h2>

            <p className="text-sm sm:text-base text-emerald-50 leading-relaxed mb-6">
              Hasil pengerjaan LKPD Sistem Penginderaan Jauh kelas <strong className="text-white">{submission.kelas}</strong> kelompok <strong className="text-white">{submission.groupNumber}</strong> telah sukses tersimpan dalam database real-time guru. Jawaban telah terkunci untuk proses evaluasi.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 font-medium">
                <Clock className="w-4 h-4 text-emerald-300" /> Dikumpulkan: {formatDate(submission.submittedAt)}
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 font-medium">
                <Users className="w-4 h-4 text-sky-300" /> {submission.members.length} Anggota Siswa
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4">
              <FileCheck2 className="w-4 h-4 text-sky-200" />
              <span>Tahap Akhir: Lembar Kerja Siap Dikumpulkan</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
              Ringkasan Pengerjaan, {submission.groupName}!
            </h2>

            <p className="text-sm sm:text-base text-sky-100 leading-relaxed mb-6">
              Kelompokmu telah menyelesaikan lembar aktivitas penginderaan jauh. Periksa kelengkapan jawaban kelompokmu di bawah ini sebelum mengirimkan hasil akhir ke Guru.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-900 font-black text-sm shadow-xl shadow-emerald-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>KUMPULKAN JAWABAN KE GURU SEKARANG</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Pre-Submission Checklist Card (if not yet submitted) */}
      {!isSubmitted && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Pemeriksaan Kelengkapan Aktivitas
              </h3>
              <p className="text-xs text-slate-500">
                Pastikan seluruh komponen jawaban sudah diisi sebelum melakukan pengumpulan resmi.
              </p>
            </div>
            <span className="px-3 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold">
              Status: Draf Pengerjaan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Identitas */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">👥</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Identitas Kelompok</h4>
                  <p className="text-[11px] text-slate-500">
                    Kelas {submission.kelas} • Kelompok {submission.groupNumber} ({submission.members.length} Siswa)
                  </p>
                </div>
              </div>
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                ✓
              </span>
            </div>

            {/* Aktivitas 1 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🛰</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Aktivitas 1: Susun Sistem</h4>
                  <p className="text-[11px] text-slate-500">
                    Urutan Alur, Contoh & {act1TableCount}/7 Tabel Komponen Terisi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onReviewSection(3)}
                className="text-xs text-sky-600 font-bold hover:underline"
              >
                Ubah / Cek
              </button>
            </div>

            {/* Aktivitas 2 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📡</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Aktivitas 2: Aktif atau Pasif</h4>
                  <p className="text-[11px] text-slate-500">
                    {act2AnsweredCount}/6 Kasus Terjawab dengan Alasan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onReviewSection(4)}
                className="text-xs text-sky-600 font-bold hover:underline"
              >
                Ubah / Cek
              </button>
            </div>

            {/* Aktivitas 3 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔎</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Aktivitas 3: Detektif Citra & Manfaat</h4>
                  <p className="text-[11px] text-slate-500">
                    {act3DetCount}/4 Objek Terpilih • Studi Kasus Hutan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onReviewSection(5)}
                className="text-xs text-sky-600 font-bold hover:underline"
              >
                Ubah / Cek
              </button>
            </div>

            {/* Refleksi */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">💬</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Refleksi Pembelajaran</h4>
                  <p className="text-[11px] text-slate-500">
                    {refCount}/4 Pertanyaan Refleksi Esai
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onReviewSection(6)}
                className="text-xs text-sky-600 font-bold hover:underline"
              >
                Ubah / Cek
              </button>
            </div>

            {/* Exit Ticket */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎫</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Exit Ticket</h4>
                  <p className="text-[11px] text-slate-500">
                    {exitCount}/4 Pertanyaan Pengukur Terisi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onReviewSection(7)}
                className="text-xs text-sky-600 font-bold hover:underline"
              >
                Ubah / Cek
              </button>
            </div>
          </div>

          {/* Big action bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onReviewSection(3)}
              className="px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span>Kembali & Edit Jawaban</span>
            </button>

            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>KUMPULKAN JAWABAN LKPD KE GURU</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Teacher Grading Card (If Already Graded) */}
      {isGraded ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-400 shadow-xl relative">
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-2xl shadow-xs">
                🏆
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
                  Hasil Penilaian Guru
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Nilai Akhir LKPD
                </h3>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600">
                {submission.score?.total} <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Oleh {submission.score?.gradedBy || 'Guru Geografi'}
              </div>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Aktivitas 1</span>
              <span className="text-base font-extrabold text-slate-900">
                {submission.score?.activity1} <span className="text-xs font-normal text-slate-400">/ 40</span>
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Aktivitas 2</span>
              <span className="text-base font-extrabold text-slate-900">
                {submission.score?.activity2} <span className="text-xs font-normal text-slate-400">/ 30</span>
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Aktivitas 3</span>
              <span className="text-base font-extrabold text-slate-900">
                {submission.score?.activity3} <span className="text-xs font-normal text-slate-400">/ 20</span>
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Refleksi</span>
              <span className="text-base font-extrabold text-slate-900">
                {submission.score?.reflection} <span className="text-xs font-normal text-slate-400">/ 10</span>
              </span>
            </div>
          </div>

          {/* Teacher Feedback Note */}
          {submission.score?.feedback && (
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                <span>Catatan & Evaluasi Guru:</span>
              </div>
              <p className="text-sm text-slate-700 italic">
                &ldquo;{submission.score.feedback}&rdquo;
              </p>
            </div>
          )}
        </div>
      ) : isSubmitted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              ⏳
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Menunggu Penilaian Guru</h3>
              <p className="text-xs text-slate-500">
                Lembar kerja kelompokmu sedang dalam antrean pemeriksaan oleh Guru Geografi di dashboard monitoring.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold shrink-0">
            Status: Sudah Mengumpulkan
          </span>
        </div>
      ) : null}

      {/* 4. Review Section Shortcuts */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isSubmitted ? 'Tinjau Jawaban Kelompok (Mode Baca)' : 'Pratinjau Lembar Aktivitas'}
            </h3>
            <p className="text-xs text-slate-500">
              Klik pada bagian di bawah ini untuk melihat kembali jawaban yang telah dimasukkan.
            </p>
          </div>

          {isUnlockedByTeacher && (
            <button
              onClick={onEditRequest}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>EDIT JAWABAN (Izin Guru Diberikan)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { step: 3, label: 'Aktivitas 1: Susun Sistem', icon: '🛰' },
            { step: 4, label: 'Aktivitas 2: Aktif atau Pasif', icon: '📡' },
            { step: 5, label: 'Aktivitas 3: Detektif Citra', icon: '🔎' },
            { step: 6, label: 'Refleksi Pembelajaran', icon: '💬' },
            { step: 7, label: 'Exit Ticket', icon: '🎫' },
          ].map((sec) => (
            <button
              key={sec.step}
              onClick={() => onReviewSection(sec.step)}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-sky-50/50 hover:border-sky-300 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{sec.icon}</span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-sky-800 transition-colors">
                  {sec.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Modal for Final Submit */}
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
                onClick={handleFinalSubmit}
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
