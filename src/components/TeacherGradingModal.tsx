import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Unlock,
  Save,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { SubmissionDoc, GradingScore } from '../types/lkpd';
import { gradeSubmission, reopenSubmission, resetSubmission } from '../services/submissionService';

interface TeacherGradingModalProps {
  submission: SubmissionDoc | null;
  onClose: () => void;
  onGraded: () => void;
}

export const TeacherGradingModal: React.FC<TeacherGradingModalProps> = ({
  submission,
  onClose,
  onGraded,
}) => {
  const [act1Score, setAct1Score] = useState<number>(35);
  const [act2Score, setAct2Score] = useState<number>(25);
  const [act3Score, setAct3Score] = useState<number>(18);
  const [refScore, setRefScore] = useState<number>(10);
  const [feedback, setFeedback] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (submission) {
      if (submission.score) {
        setAct1Score(submission.score.activity1 ?? 35);
        setAct2Score(submission.score.activity2 ?? 25);
        setAct3Score(submission.score.activity3 ?? 18);
        setRefScore(submission.score.reflection ?? 10);
        setFeedback(submission.score.feedback ?? '');
      } else {
        // default suggestion
        setAct1Score(35);
        setAct2Score(25);
        setAct3Score(18);
        setRefScore(10);
        setFeedback('Kerja kelompok sangat baik dan sistematis.');
      }
    }
  }, [submission]);

  if (!submission) return null;

  const totalScore = Math.min(100, Math.max(0, act1Score + act2Score + act3Score + refScore));

  const handleSaveGrading = async () => {
    setSaving(true);
    try {
      const scoreObj: GradingScore = {
        activity1: act1Score,
        activity2: act2Score,
        activity3: act3Score,
        reflection: refScore,
        total: totalScore,
        feedback,
      };
      await gradeSubmission(submission.id, scoreObj);
      setToastMsg('Nilai dan evaluasi berhasil disimpan!');
      setTimeout(() => {
        setToastMsg('');
        onGraded();
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to grade:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReopen = async () => {
    if (!confirm('Buka kembali pengerjaan kelompok ini agar siswa dapat mengedit jawaban mereka?')) {
      return;
    }
    setSaving(true);
    try {
      await reopenSubmission(submission.id);
      setToastMsg('Pengerjaan kelompok berhasil dibuka kembali untuk revisi siswa.');
      setTimeout(() => {
        setToastMsg('');
        onGraded();
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to reopen:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetGroup = async () => {
    if (
      !confirm(
        `PERINGATAN: Apakah Anda yakin ingin me-reset seluruh aktivitas Kelompok ${submission.groupNumber} (${submission.kelas})?\n\nSemua jawaban akan dikosongkan dan status diatur ulang ke Belum Mulai.`
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      await resetSubmission(
        submission.id,
        submission.kelas,
        submission.groupNumber,
        submission.groupName,
        submission.members
      );
      setToastMsg('Aktivitas kelompok berhasil di-reset ke kondisi awal!');
      setTimeout(() => {
        setToastMsg('');
        onGraded();
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to reset group:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-sky-100 my-8 max-h-[90vh] flex flex-col relative text-left">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 text-xs font-bold">
                Kelas {submission.kelas}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                Kelompok {submission.groupNumber}
              </span>
              <span className="text-xs font-medium text-slate-500">•</span>
              <span className="text-xs font-semibold text-slate-700">{submission.groupName}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Evaluasi & Penilaian Jawaban Siswa
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-2 py-4 space-y-6 flex-1">
          
          {/* Group Identity Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>Anggota Kelompok ({submission.members.length} Siswa):</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {submission.members.map((m, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                >
                  {idx === 0 ? '👑 ' : ''}{m}
                </span>
              ))}
            </div>
          </div>

          {/* Toast Message */}
          {toastMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Review Answers Breakdown */}
          <div className="space-y-5">
            
            {/* Aktivitas 1 Answers */}
            <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-sky-900 flex items-center gap-2">
                  <span>🛰 Aktivitas 1: Susun Sistem (Maks. 40 Poin)</span>
                </h4>
              </div>

              {/* Case study response */}
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-700">Analisis Studi Kasus Bencana:</span>
                <p className="text-slate-800 italic bg-white p-2.5 rounded-lg border border-slate-200">
                  {submission.activity1?.caseStudyAnswer || '(Belum diisi oleh siswa)'}
                </p>
              </div>

              {/* Ordering */}
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-700">Urutan 7 Komponen yang Disusun Siswa:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {submission.activity1?.componentOrder?.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-md font-medium text-[11px]"
                    >
                      {i + 1}. {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Component Essay Table */}
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-2">
                <span className="font-bold text-slate-700">Tabel Komponen (Fungsi & Contoh Esai):</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-200 text-slate-700">
                        <th className="p-2 font-bold w-28">Komponen</th>
                        <th className="p-2 font-bold">Jawaban Fungsi (Esai)</th>
                        <th className="p-2 font-bold">Jawaban Contoh (Esai)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {Object.entries(submission.activity1?.componentTable || {}).map(([compName, val]) => (
                        <tr key={compName}>
                          <td className="p-2 font-bold text-slate-900">{compName}</td>
                          <td className="p-2 text-slate-700">{val.fungsi || '-'}</td>
                          <td className="p-2 text-slate-700">{val.contoh || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Independent Essay Response */}
              {submission.activity1?.independentEssay && (
                <div className="p-3 bg-amber-50 rounded-xl text-xs space-y-1 border border-amber-200">
                  <span className="font-bold text-amber-900">Jawaban Esai Mandiri Siswa (Tanpa Petunjuk):</span>
                  <p className="text-slate-800 italic bg-white p-2.5 rounded-lg border border-amber-100">
                    {submission.activity1.independentEssay}
                  </p>
                </div>
              )}
            </div>

            {/* Aktivitas 2 Answers */}
            <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-teal-900">
                📡 Aktivitas 2: Aktif atau Pasif? (6 Kasus) (Maks. 30 Poin)
              </h4>
              <div className="space-y-2">
                {submission.activity2?.cases?.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">Kasus {c.id}: {c.scenario}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          c.choice === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.choice === 'Pasif'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        Pilihan Siswa: {c.choice || 'Kosong'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] italic bg-white p-2 rounded border border-slate-100">
                      <strong>Alasan Siswa:</strong> {c.reason || '(Tidak ada alasan)'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Aktivitas 3 Answers */}
            <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-amber-900">
                🔎 Aktivitas 3: Detektif Citra & Manfaat (Maks. 20 Poin)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {Object.entries(submission.activity3?.identifications || {}).map(([key, val]) => (
                  <div key={key} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="font-bold text-slate-600 block">{key.toUpperCase()}:</span>
                    <span className="font-extrabold text-amber-800">{val || '-'}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-800">Q1: Mengapa cocok untuk kasus hutan?</span>
                  <p className="text-slate-700 italic bg-white p-2 rounded border border-slate-100 mt-0.5">
                    {submission.activity3?.caseStudy?.question1 || '-'}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-800">Q2: Siapa pihak yang memanfaatkan data?</span>
                  <p className="text-slate-700 italic bg-white p-2 rounded border border-slate-100 mt-0.5">
                    {submission.activity3?.caseStudy?.question2 || '-'}
                  </p>
                </div>
              </div>

              {/* Independent Essay Activity 3 */}
              {submission.activity3?.independentEssay && (
                <div className="p-3 bg-amber-50 rounded-xl text-xs space-y-1 border border-amber-200">
                  <span className="font-bold text-amber-900">Analisis Esai Mandiri Siswa (Tanpa Petunjuk):</span>
                  <p className="text-slate-800 italic bg-white p-2.5 rounded-lg border border-amber-100">
                    {submission.activity3.independentEssay}
                  </p>
                </div>
              )}
            </div>

            {/* Refleksi Answers */}
            <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs space-y-2">
              <h4 className="text-sm font-bold text-indigo-900">
                💬 Refleksi Pembelajaran (Maks. 10 Poin)
              </h4>
              <div className="space-y-1.5 text-xs">
                {Object.entries(submission.reflection || {}).map(([k, text]) => {
                  if (k === 'independentEssay') return null;
                  return (
                    <div key={k} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700 block uppercase">{k}:</span>
                      <p className="text-slate-800 italic mt-0.5">{text || '-'}</p>
                    </div>
                  );
                })}
              </div>

              {/* Independent Reflection Essay */}
              {submission.reflection?.independentEssay && (
                <div className="p-3 bg-indigo-50 rounded-xl text-xs space-y-1 border border-indigo-200">
                  <span className="font-bold text-indigo-900">Esai Refleksi Mandiri Siswa (Tanpa Petunjuk):</span>
                  <p className="text-slate-800 italic bg-white p-2.5 rounded-lg border border-indigo-100">
                    {submission.reflection.independentEssay}
                  </p>
                </div>
              )}
            </div>

            {/* Exit Ticket */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs space-y-2">
              <h4 className="text-sm font-bold text-emerald-900">
                🎫 Exit Ticket
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(submission.exitTicket || {}).map(([k, text]) => (
                  <div key={k} className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700 uppercase">{k}: </span>
                    <span className="text-slate-800">{text || '-'}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Form Rubrik Penilaian Guru */}
          <div className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-2xl p-5 border-2 border-emerald-300 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <h4 className="text-base font-black text-slate-900">Rubrik Penilaian Operator (Total: 100)</h4>
              </div>
              <div className="text-xl font-black text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-200 shadow-xs">
                Total: {totalScore} / 100
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aktivitas 1 (Maks. 40)
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={act1Score}
                  onChange={(e) => setAct1Score(Math.min(40, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-sm text-center text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aktivitas 2 (Maks. 30)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={act2Score}
                  onChange={(e) => setAct2Score(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-sm text-center text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aktivitas 3 (Maks. 20)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={act3Score}
                  onChange={(e) => setAct3Score(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-sm text-center text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Refleksi (Maks. 10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={refScore}
                  onChange={(e) => setRefScore(Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-sm text-center text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Evaluasi / Komentar Guru untuk Kelompok:
              </label>
              <textarea
                rows={2}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Berikan masukan konstruktif untuk kelompok ini..."
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 shrink-0">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={saving}
              onClick={handleReopen}
              className="px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              title="Buka kembali pengerjaan jika siswa membutuhkan revisi"
            >
              <Unlock className="w-3.5 h-3.5 text-amber-700" />
              <span>Buka Kembali Pengerjaan</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleResetGroup}
              className="px-3.5 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              title="Reset seluruh aktivitas kelompok ke kondisi awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset Aktivitas Kelompok</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
            >
              Tutup
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSaveGrading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'SIMPAN PENILAIAN'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
