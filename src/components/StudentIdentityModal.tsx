import React, { useState, useEffect } from 'react';
import { X, Users, ArrowRight, Sparkles, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { KelasType, SubmissionDoc } from '../types/lkpd';
import { KELAS_LIST, GROUP_NUMBERS, createEmptySubmission } from '../constants/lkpdData';
import { getSubmission, saveSubmission } from '../services/submissionService';

interface StudentIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (submission: SubmissionDoc) => void;
}

export const StudentIdentityModal: React.FC<StudentIdentityModalProps> = ({
  isOpen,
  onClose,
  onStartSession,
}) => {
  const [kelas, setKelas] = useState<KelasType>('X-A');
  const [groupNumber, setGroupNumber] = useState<number>(1);
  const [groupName, setGroupName] = useState<string>('Tim Landsat-9');
  const [members, setMembers] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const [existingData, setExistingData] = useState<SubmissionDoc | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Check if this class + group already has existing saved submission
  useEffect(() => {
    let isMounted = true;
    async function checkExisting() {
      const docId = `${kelas}_kelompok_${groupNumber}`;
      setIsChecking(true);
      try {
        const doc = await getSubmission(docId);
        if (isMounted) {
          if (doc) {
            setExistingData(doc);
            if (doc.groupName) setGroupName(doc.groupName);
            if (doc.members && doc.members.length > 0) {
              const newMembers = ['', '', '', '', '', ''];
              doc.members.forEach((m, idx) => {
                if (idx < 6) newMembers[idx] = m;
              });
              setMembers(newMembers);
            }
          } else {
            setExistingData(null);
          }
        }
      } catch (err) {
        console.error('Error checking existing submission:', err);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    }

    if (isOpen) {
      checkExisting();
    }

    return () => {
      isMounted = false;
    };
  }, [kelas, groupNumber, isOpen]);

  if (!isOpen) return null;

  const handleMemberChange = (index: number, value: string) => {
    const updated = [...members];
    updated[index] = value;
    setMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const filledMembers = members.map((m) => m.trim()).filter((m) => m.length > 0);
    if (filledMembers.length === 0) {
      setErrorMsg('Mohon isi minimal 1 nama anggota kelompok.');
      return;
    }

    setIsSaving(true);
    try {
      let submissionToUse: SubmissionDoc;

      if (existingData) {
        // Update member info if changed, preserve answers
        submissionToUse = {
          ...existingData,
          groupName: groupName.trim() || `Kelompok ${groupNumber}`,
          members: filledMembers,
          updatedAt: new Date().toISOString(),
        };
      } else {
        submissionToUse = createEmptySubmission(kelas, groupNumber, groupName, filledMembers);
      }

      await saveSubmission(submissionToUse);
      onStartSession(submissionToUse);
    } catch (err) {
      console.error('Failed to initialize session:', err);
      setErrorMsg('Terjadi kendala saat menyimpan identitas ke database. Coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-sky-100 my-8 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-left mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5 text-sky-600" />
            <span>Identitas Kelompok Belajar</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Masuk Sebagai Siswa
          </h2>
          <p className="text-sm text-slate-600">
            Isi identitas kelas dan kelompok sebelum memulai pengerjaan LKPD.
          </p>
        </div>

        {/* Status Existing Session Alert */}
        {isChecking ? (
          <div className="mb-4 p-3 bg-sky-50 rounded-xl flex items-center gap-2 text-xs text-sky-700">
            <RefreshCw className="w-4 h-4 animate-spin text-sky-500" />
            <span>Memeriksa riwayat pengerjaan kelompok di database...</span>
          </div>
        ) : existingData ? (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                Data kelompok ditemukan di database ({existingData.status === 'sudah_mengumpulkan' ? 'Sudah Mengumpulkan' : 'Sedang Mengerjakan'})!
              </p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Kamu dapat langsung melanjutkan pengerjaan atau meninjau jawaban yang telah tersimpan.
              </p>
            </div>
          </div>
        ) : null}

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-medium text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Class & Group Number Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kelas
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value as KelasType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm shadow-xs"
              >
                {KELAS_LIST.map((k) => (
                  <option key={k} value={k}>
                    Kelas {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor Kelompok
              </label>
              <select
                value={groupNumber}
                onChange={(e) => setGroupNumber(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm shadow-xs"
              >
                {GROUP_NUMBERS.map((n) => (
                  <option key={n} value={n}>
                    Kelompok {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Group Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Kelompok
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Contoh: Tim Landsat-9 / Tim Radar Geospasial"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-xs"
            />
          </div>

          {/* Members 1 to 6 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nama Anggota Kelompok (Maks. 6 Siswa)
              </label>
              <span className="text-[11px] text-slate-500">Min. 1 siswa terisi</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {members.map((mem, index) => (
                <div key={index} className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={mem}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    placeholder={index === 0 ? 'Nama Anggota 1 (Ketua)' : `Nama Anggota ${index + 1}`}
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving || isChecking}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-bold text-sm shadow-md shadow-sky-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyiapkan Lembar Kerja...</span>
                </>
              ) : existingData ? (
                <>
                  <span>LANJUTKAN LKPD ({existingData.kelas} - Kelompok {existingData.groupNumber})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>MULAI LKPD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
