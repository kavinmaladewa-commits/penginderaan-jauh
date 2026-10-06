import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Filter,
  Search,
  Award,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpDown,
  Eye,
  FileText,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { SubmissionDoc, KelasType } from '../types/lkpd';
import { KELAS_LIST } from '../constants/lkpdData';

interface TeacherGradeRecapProps {
  submissions: SubmissionDoc[];
  onOpenGrading: (sub: SubmissionDoc) => void;
  onResetGroup?: (sub: SubmissionDoc) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const TeacherGradeRecap: React.FC<TeacherGradeRecapProps> = ({
  submissions,
  onOpenGrading,
  onResetGroup,
  onRefresh,
  isRefreshing = false,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterGradedOnly, setFilterGradedOnly] = useState<boolean>(false);

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (selectedClass !== 'ALL' && sub.kelas !== selectedClass) return false;
    if (filterGradedOnly && sub.status !== 'sudah_dinilai') return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      sub.kelas.toLowerCase().includes(term) ||
      `kelompok ${sub.groupNumber}`.includes(term) ||
      sub.groupName.toLowerCase().includes(term) ||
      sub.members.some((m) => m.toLowerCase().includes(term))
    );
  });

  // Calculate statistics
  const gradedList = filteredSubmissions.filter(
    (s) => s.status === 'sudah_dinilai' && s.score && typeof s.score.total === 'number'
  );

  const totalGroups = filteredSubmissions.length;
  const gradedCount = gradedList.length;
  const submittedCount = filteredSubmissions.filter((s) => s.status === 'sudah_mengumpulkan').length;

  const totalScores = gradedList.map((s) => s.score!.total);
  const avgTotal =
    gradedCount > 0 ? (totalScores.reduce((a, b) => a + b, 0) / gradedCount).toFixed(1) : '-';
  const maxScore = gradedCount > 0 ? Math.max(...totalScores) : '-';
  const minScore = gradedCount > 0 ? Math.min(...totalScores) : '-';

  // Sub-scores averages
  const avgAct1 =
    gradedCount > 0
      ? (gradedList.reduce((acc, s) => acc + (s.score?.activity1 || 0), 0) / gradedCount).toFixed(1)
      : '-';
  const avgAct2 =
    gradedCount > 0
      ? (gradedList.reduce((acc, s) => acc + (s.score?.activity2 || 0), 0) / gradedCount).toFixed(1)
      : '-';
  const avgAct3 =
    gradedCount > 0
      ? (gradedList.reduce((acc, s) => acc + (s.score?.activity3 || 0), 0) / gradedCount).toFixed(1)
      : '-';
  const avgRef =
    gradedCount > 0
      ? (gradedList.reduce((acc, s) => acc + (s.score?.reflection || 0), 0) / gradedCount).toFixed(1)
      : '-';

  // KKTP / Passing threshold: 75
  const passedCount = gradedList.filter((s) => (s.score?.total || 0) >= 75).length;
  const passingRate = gradedCount > 0 ? Math.round((passedCount / gradedCount) * 100) : 0;

  // Predicate calculator
  const getPredicate = (total: number) => {
    if (total >= 90) return { label: 'Sangat Baik (A)', color: 'text-emerald-700 bg-emerald-50' };
    if (total >= 80) return { label: 'Baik (B)', color: 'text-sky-700 bg-sky-50' };
    if (total >= 70) return { label: 'Cukup (C)', color: 'text-amber-700 bg-amber-50' };
    return { label: 'Perlu Bimbingan (D)', color: 'text-rose-700 bg-rose-50' };
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'No',
      'Kelas',
      'Kelompok',
      'Nama Kelompok',
      'Anggota Siswa',
      'Status',
      'Aktivitas 1 (40)',
      'Aktivitas 2 (30)',
      'Aktivitas 3 (20)',
      'Refleksi (10)',
      'Total Nilai (100)',
      'Predikat',
      'Catatan Guru',
      'Waktu Pengumpulan',
      'Waktu Penilaian',
    ];

    const rows = filteredSubmissions.map((s, idx) => {
      const score = s.score;
      const pred = score ? getPredicate(score.total).label : '-';
      return [
        idx + 1,
        `"${s.kelas}"`,
        `"Kelompok ${s.groupNumber}"`,
        `"${s.groupName.replace(/"/g, '""')}"`,
        `"${s.members.join(', ').replace(/"/g, '""')}"`,
        `"${s.status}"`,
        score?.activity1 ?? '-',
        score?.activity2 ?? '-',
        score?.activity3 ?? '-',
        score?.reflection ?? '-',
        score?.total ?? '-',
        `"${pred}"`,
        `"${(score?.feedback || '').replace(/"/g, '""')}"`,
        `"${s.submittedAt ? new Date(s.submittedAt).toLocaleString('id-ID') : '-'}"`,
        `"${score?.gradedAt ? new Date(score.gradedAt).toLocaleString('id-ID') : '-'}"`,
      ];
    });

    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const classNameSuffix = selectedClass === 'ALL' ? 'Semua_Kelas' : selectedClass;
    link.download = `Rekap_Nilai_LKPD_Penginderaan_Jauh_${classNameSuffix}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
              Laporan Evaluasi
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">SMANDASA Geografi Kelas X</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Rekapitulasi Nilai LKPD Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar lengkap perolehan skor per aktivitas, nilai total, predikat capaian, dan catatan evaluasi guru.
          </p>
        </div>

        {/* Export and Print Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-all shadow-xs"
              title="Perbarui data rekap nilai dari Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : 'text-sky-500'}`} />
              <span>{isRefreshing ? 'Memperbarui...' : 'Refresh'}</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Excel / CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Lembar Nilai</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Rata-Rata Nilai */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Rata-Rata Nilai
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{avgTotal}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Dari {gradedCount} kelompok dinilai
          </span>
        </div>

        {/* Nilai Tertinggi */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Nilai Tertinggi
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-sky-600">{maxScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Skor maksimal kelas</span>
        </div>

        {/* Nilai Terendah */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Nilai Terendah
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{minScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Skor minimal kelas</span>
        </div>

        {/* Ketuntasan (KKTP >= 75) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Ketuntasan (≥75)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-teal-600">{passingRate}%</span>
          </div>
          <span className="text-[11px] text-teal-700 font-semibold block mt-1">
            {passedCount} dari {gradedCount} tuntas
          </span>
        </div>

        {/* Sudah Dinilai */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Status Dinilai
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-blue-600">{gradedCount}</span>
            <span className="text-xs text-slate-400">kelompok</span>
          </div>
          <span className="text-[11px] text-blue-700 font-semibold block mt-1">
            Tuntas diperiksa
          </span>
        </div>

        {/* Menunggu Penilaian */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Antrean Nilai
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{submittedCount}</span>
            <span className="text-xs text-slate-400">kelompok</span>
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block mt-1">
            Menunggu dievaluasi
          </span>
        </div>

      </div>

      {/* Rata-Rata Sub-Aktivitas Breakdown Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-700">Rata-Rata Komponen Aktivitas Kelas:</span>
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-800">
            Aktivitas 1: <strong>{avgAct1}</strong> / 40
          </span>
          <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-800">
            Aktivitas 2: <strong>{avgAct2}</strong> / 30
          </span>
          <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-800">
            Aktivitas 3: <strong>{avgAct3}</strong> / 20
          </span>
          <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-800">
            Refleksi: <strong>{avgRef}</strong> / 10
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm space-y-4">
        {/* Class Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 mr-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Kelas:
          </span>
          <button
            onClick={() => setSelectedClass('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedClass === 'ALL'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Kelas (10 Kelas)
          </button>
          {KELAS_LIST.map((k) => (
            <button
              key={k}
              onClick={() => setSelectedClass(k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedClass === k
                  ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Search input & checkbox */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <span className="absolute left-3.5 top-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama kelompok, kelas, atau nama anggota siswa..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={filterGradedOnly}
              onChange={(e) => setFilterGradedOnly(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
            />
            <span>Hanya Kelompok yang Sudah Dinilai ({gradedCount})</span>
          </label>
        </div>
      </div>

      {/* Main Grade Recap Table */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tabel Rekapitulasi Nilai & Evaluasi
            </h3>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredSubmissions.length} data pengerjaan LKPD ({selectedClass === 'ALL' ? 'Semua Kelas' : `Kelas ${selectedClass}`})
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="p-3 font-bold text-center w-12">No</th>
                <th className="p-3 font-bold">Kelas</th>
                <th className="p-3 font-bold">Kelompok</th>
                <th className="p-3 font-bold min-w-[180px]">Nama Tim & Anggota</th>
                <th className="p-3 font-bold text-center">Akt 1 (40)</th>
                <th className="p-3 font-bold text-center">Akt 2 (30)</th>
                <th className="p-3 font-bold text-center">Akt 3 (20)</th>
                <th className="p-3 font-bold text-center">Refleksi (10)</th>
                <th className="p-3 font-bold text-center">Total Nilai</th>
                <th className="p-3 font-bold">Predikat</th>
                <th className="p-3 font-bold min-w-[200px]">Catatan / Feedback Guru</th>
                <th className="p-3 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-400 italic">
                    Belum ada data pengerjaan yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, idx) => {
                  const score = sub.score;
                  const isDoneGrading = sub.status === 'sudah_dinilai' && score;
                  const pred = isDoneGrading ? getPredicate(score.total) : null;

                  return (
                    <tr key={sub.id} className="hover:bg-sky-50/30 transition-colors">
                      {/* No */}
                      <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>

                      {/* Kelas */}
                      <td className="p-3 font-extrabold text-slate-900">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                          {sub.kelas}
                        </span>
                      </td>

                      {/* Kelompok */}
                      <td className="p-3 font-bold text-slate-800">
                        Kelompok {sub.groupNumber}
                      </td>

                      {/* Nama Tim & Anggota */}
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{sub.groupName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {sub.members.join(', ')}
                        </div>
                      </td>

                      {/* Akt 1 */}
                      <td className="p-3 text-center font-semibold text-slate-700">
                        {score?.activity1 ?? '-'}
                      </td>

                      {/* Akt 2 */}
                      <td className="p-3 text-center font-semibold text-slate-700">
                        {score?.activity2 ?? '-'}
                      </td>

                      {/* Akt 3 */}
                      <td className="p-3 text-center font-semibold text-slate-700">
                        {score?.activity3 ?? '-'}
                      </td>

                      {/* Refleksi */}
                      <td className="p-3 text-center font-semibold text-slate-700">
                        {score?.reflection ?? '-'}
                      </td>

                      {/* Total */}
                      <td className="p-3 text-center">
                        {isDoneGrading ? (
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-black text-sm">
                            {score.total}
                          </span>
                        ) : sub.status === 'sudah_mengumpulkan' ? (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Antrean
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>

                      {/* Predikat */}
                      <td className="p-3">
                        {pred ? (
                          <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${pred.color}`}>
                            {pred.label}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Catatan Guru */}
                      <td className="p-3">
                        <div className="text-[11px] text-slate-600 italic line-clamp-2">
                          {score?.feedback || '-'}
                        </div>
                      </td>

                      {/* Aksi */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onResetGroup && (
                            <button
                              onClick={() => onResetGroup(sub)}
                              className="px-2 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700"
                              title="Reset aktivitas kelompok ini"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset</span>
                            </button>
                          )}

                          <button
                            onClick={() => onOpenGrading(sub)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 ${
                              sub.status === 'sudah_dinilai'
                                ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{sub.status === 'sudah_dinilai' ? 'Ubah Nilai' : 'Beri Nilai'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
