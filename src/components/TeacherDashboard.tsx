import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Printer,
  Award,
  CheckCircle2,
  Clock,
  Eye,
  LogOut,
  Radio,
  FileSpreadsheet,
  Activity,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { KelasType, SubmissionDoc, TeacherUser } from '../types/lkpd';
import { KELAS_LIST, GROUP_NUMBERS } from '../constants/lkpdData';
import {
  listenToAllSubmissions,
  getAllSubmissionsOnce,
  resetSubmission,
} from '../services/submissionService';
import { TeacherGradingModal } from './TeacherGradingModal';
import { TeacherGradeRecap } from './TeacherGradeRecap';

interface TeacherDashboardProps {
  teacher: TeacherUser;
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'rekap'>('monitoring');
  const [submissions, setSubmissions] = useState<SubmissionDoc[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSubForGrading, setSelectedSubForGrading] = useState<SubmissionDoc | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [isResettingBatch, setIsResettingBatch] = useState<boolean>(false);

  // Manual refresh from Firestore
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await getAllSubmissionsOnce();
      setSubmissions(fresh);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
      setToastMessage('Data progres berhasil diperbarui dari Firestore.');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error('Refresh error:', err);
      setToastMessage('Gagal memperbarui data.');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Single-button direct reset for a specific group: immediately wipes data so no answers remain
  const handleDirectReset = async (id: string, kelas: string, groupNumber: number) => {
    setResettingId(id);
    try {
      await resetSubmission(id);
      // Immediately remove from local state for instant responsive UI
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setToastMessage(
        `Aktivitas Kelompok ${groupNumber} (${kelas}) berhasil di-reset. Seluruh jawaban langsung dihapus dari sistem.`
      );
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      console.error('Reset error:', err);
      setToastMessage('Gagal me-reset aktivitas kelompok.');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setResettingId(null);
    }
  };

  // Direct reset for all groups in currently selected class
  const handleResetSelectedClass = async () => {
    const targets = selectedClass === 'ALL'
      ? submissions
      : submissions.filter((s) => s.kelas === selectedClass);

    if (targets.length === 0) {
      setToastMessage('Tidak ada data aktivitas yang tersimpan untuk di-reset.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    setIsResettingBatch(true);
    try {
      await Promise.all(targets.map((t) => resetSubmission(t.id)));
      const targetIds = new Set(targets.map((t) => t.id));
      setSubmissions((prev) => prev.filter((s) => !targetIds.has(s.id)));
      setToastMessage(
        `Berhasil mereset seluruh data ${targets.length} kelompok (${selectedClass === 'ALL' ? 'Semua Kelas' : `Kelas ${selectedClass}`}). Seluruh lembar jawaban telah dihapus.`
      );
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      console.error('Reset batch error:', err);
      setToastMessage('Gagal me-reset beberapa kelompok.');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setIsResettingBatch(false);
    }
  };

  // Firestore Real-Time listener
  useEffect(() => {
    const unsub = listenToAllSubmissions(
      (items) => {
        setSubmissions(items);
        setIsLiveConnected(true);
        setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
      },
      (err) => {
        console.error('Real-time listener error:', err);
        setIsLiveConnected(false);
      }
    );

    return () => unsub();
  }, []);

  // Compute 60 total possible slots (10 classes * 6 groups)
  // Merge live submissions with unstarted group slots for full class monitoring
  const classesToDisplay = selectedClass === 'ALL' ? KELAS_LIST : [selectedClass as KelasType];

  const fullGridData: {
    id: string;
    kelas: KelasType;
    groupNumber: number;
    submission: SubmissionDoc | null;
  }[] = [];

  classesToDisplay.forEach((k) => {
    GROUP_NUMBERS.forEach((g) => {
      const docId = `${k}_kelompok_${g}`;
      const found = submissions.find((s) => s.id === docId || (s.kelas === k && s.groupNumber === g));
      fullGridData.push({
        id: docId,
        kelas: k,
        groupNumber: g,
        submission: found || null,
      });
    });
  });

  // Filter by search
  const filteredGridData = fullGridData.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const sub = item.submission;
    if (item.kelas.toLowerCase().includes(term)) return true;
    if (`kelompok ${item.groupNumber}`.includes(term)) return true;
    if (sub?.groupName.toLowerCase().includes(term)) return true;
    if (sub?.members.some((m) => m.toLowerCase().includes(term))) return true;
    return false;
  });

  // Calculate statistics
  const totalSlots = fullGridData.length;
  const startedSubs = fullGridData.filter((i) => i.submission !== null);
  const belumMulaiCount = fullGridData.filter((i) => !i.submission || i.submission.status === 'belum_mulai').length;
  const sedangMengerjakanCount = fullGridData.filter((i) => i.submission?.status === 'sedang_mengerjakan').length;
  const sudahMengumpulkanCount = fullGridData.filter((i) => i.submission?.status === 'sudah_mengumpulkan').length;
  const sudahDinilaiCount = fullGridData.filter((i) => i.submission?.status === 'sudah_dinilai').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left animate-in fade-in duration-300">
      
      {/* Top Bar: Operator Header & Live Sync Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Operator Aktif
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-600">SMANDASA Geografi Kelas X</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Monitoring LKPD
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau progres aktivitas siswa dan lakukan penilaian secara real-time melalui koneksi Firebase Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
            <Radio className={`w-3.5 h-3.5 ${isLiveConnected ? 'text-emerald-500 animate-pulse' : 'text-rose-500'}`} />
            <span>{isLiveConnected ? 'Live Firestore Aktif' : 'Menghubungkan...'}</span>
            {lastSyncTime && <span className="text-slate-400">({lastSyncTime})</span>}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-all shadow-xs"
            title="Perbarui progres atau hasil aktivitas siswa dari Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : 'text-sky-500'}`} />
            <span>{isRefreshing ? 'Memperbarui...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            title="Cetak Laporan Rekap Nilai"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Cetak Rekap</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback Message */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Tabs: Monitoring vs Rekap Nilai */}
      <div className="flex items-center gap-3 border-b border-sky-100 pb-2">
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'monitoring'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 scale-[1.02]'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Monitoring Progres Real-Time</span>
        </button>

        <button
          onClick={() => setActiveTab('rekap')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'rekap'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Rekapitulasi Nilai Siswa</span>
          {submissions.filter((s) => s.status === 'sudah_dinilai').length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'rekap' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {submissions.filter((s) => s.status === 'sudah_dinilai').length}
            </span>
          )}
        </button>
      </div>

      {/* View 1: Rekap Nilai Siswa */}
      {activeTab === 'rekap' ? (
        <TeacherGradeRecap
          submissions={submissions}
          onOpenGrading={(sub) => setSelectedSubForGrading(sub)}
          onResetGroup={(sub) => handleDirectReset(sub.id, sub.kelas, sub.groupNumber)}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
        />
      ) : (
        /* View 2: Monitoring Progres Slot */
        <>
          {/* 5 Statistics Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Total Groups */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Kelompok
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalSlots}</span>
            <span className="text-xs text-slate-500 font-medium">Slot</span>
          </div>
          <span className="text-[11px] text-sky-600 font-semibold block mt-1">
            {startedSubs.length} kelompok aktif
          </span>
        </div>

        {/* Belum Mulai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Belum Mulai
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">{belumMulaiCount}</span>
            <span className="text-xs text-slate-400">kelompok</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Belum membuka LKPD</span>
        </div>

        {/* Sedang Mengerjakan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Mengerjakan
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{sedangMengerjakanCount}</span>
            <span className="text-xs text-slate-400">kelompok</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Aktif di LKPD</span>
        </div>

        {/* Sudah Mengumpulkan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Mengumpulkan
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{sudahMengumpulkanCount}</span>
            <span className="text-xs text-slate-400">kelompok</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">Siap dinilai guru</span>
        </div>

        {/* Sudah Dinilai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Sudah Dinilai
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-600">{sudahDinilaiCount}</span>
            <span className="text-xs text-slate-400">kelompok</span>
          </div>
          <span className="text-[11px] text-blue-700 font-semibold block mt-1">Penilaian tuntas</span>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm space-y-4">
        
        {/* Class Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 mr-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Kelas:
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

        {/* Search input */}
        <div className="relative">
          <span className="absolute left-3.5 top-3 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan kelas, nomor kelompok, nama tim, atau nama anggota siswa..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Live Monitoring Table */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tabel Monitoring Real-Time Kelompok
            </h3>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredGridData.length} slot kelompok ({selectedClass === 'ALL' ? 'Semua Kelas' : `Kelas ${selectedClass}`})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSelectedClass}
              disabled={isResettingBatch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-2xs"
              title={`Klik untuk mereset seluruh kelompok di ${selectedClass === 'ALL' ? 'semua kelas' : `Kelas ${selectedClass}`}`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResettingBatch ? 'animate-spin text-rose-600' : ''}`} />
              <span>{isResettingBatch ? 'Mereset Semua...' : selectedClass === 'ALL' ? 'Reset Semua Kelompok' : `Reset Semua Kelompok ${selectedClass}`}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="p-3.5 font-bold">Kelas</th>
                <th className="p-3.5 font-bold">Kelompok</th>
                <th className="p-3.5 font-bold min-w-[200px]">Nama Tim & Anggota</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 font-bold min-w-[150px]">Progress</th>
                <th className="p-3.5 font-bold">Aktivitas Terakhir</th>
                <th className="p-3.5 font-bold text-center">Nilai</th>
                <th className="p-3.5 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGridData.map((item) => {
                const sub = item.submission;
                const status = sub?.status || 'belum_mulai';

                return (
                  <tr key={item.id} className="hover:bg-sky-50/30 transition-colors">
                    {/* Kelas */}
                    <td className="p-3.5 font-extrabold text-slate-900">
                      <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800">
                        {item.kelas}
                      </span>
                    </td>

                    {/* Nomor Kelompok */}
                    <td className="p-3.5 font-bold text-slate-800">
                      Kelompok {item.groupNumber}
                    </td>

                    {/* Nama Tim & Anggota */}
                    <td className="p-3.5">
                      {sub ? (
                        <div>
                          <div className="font-bold text-slate-900">{sub.groupName}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {sub.members.join(', ')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Belum mengisi identitas</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5">
                      {status === 'belum_mulai' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          🔴 Belum mulai
                        </span>
                      )}
                      {status === 'sedang_mengerjakan' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          🟡 Sedang mengerjakan
                        </span>
                      )}
                      {status === 'sudah_mengumpulkan' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          🟢 Sudah mengumpulkan
                        </span>
                      )}
                      {status === 'sudah_dinilai' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          🔵 Sudah dinilai
                        </span>
                      )}
                    </td>

                    {/* Progress */}
                    <td className="p-3.5">
                      {sub ? (
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                            <span>Langkah {sub.currentStep}/8</span>
                            <span>{sub.progressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500"
                              style={{ width: `${sub.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">0%</span>
                      )}
                    </td>

                    {/* Aktivitas Terakhir */}
                    <td className="p-3.5 text-[11px] text-slate-600">
                      {sub?.lastActiveSection || (sub ? `Langkah ${sub.currentStep}` : '-')}
                    </td>

                    {/* Nilai */}
                    <td className="p-3.5 text-center font-black text-sm">
                      {sub?.score ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {sub.score.total}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Tombol Reset Langsung Satu Tombol di Setiap Kelompok */}
                        <button
                          onClick={() => handleDirectReset(item.id, item.kelas, item.groupNumber)}
                          disabled={resettingId === item.id || !sub}
                          className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 border ${
                            sub
                              ? 'border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 active:scale-95 shadow-2xs cursor-pointer'
                              : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed opacity-50'
                          }`}
                          title={
                            sub
                              ? 'Klik 1 kali untuk langsung mereset & menghapus semua lembar jawaban kelompok ini'
                              : 'Kelompok belum memulai aktivitas'
                          }
                        >
                          <RotateCcw
                            className={`w-3.5 h-3.5 ${
                              resettingId === item.id ? 'animate-spin text-rose-600' : ''
                            }`}
                          />
                          <span>{resettingId === item.id ? 'Mereset...' : 'Reset'}</span>
                        </button>

                        {sub ? (
                          <button
                            onClick={() => setSelectedSubForGrading(sub)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 ${
                              sub.status === 'sudah_mengumpulkan'
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                : sub.status === 'sudah_dinilai'
                                ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{sub.status === 'sudah_dinilai' ? 'Ubah Nilai' : 'Periksa & Nilai'}</span>
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* Modal Penilaian / Detail */}
      {selectedSubForGrading && (
        <TeacherGradingModal
          submission={selectedSubForGrading}
          onClose={() => setSelectedSubForGrading(null)}
          onGraded={() => {
            // Updated automatically via onSnapshot
          }}
        />
      )}

    </div>
  );
};
