import React from 'react';
import { Globe, Satellite, User, LogOut, CheckCircle2, BookOpen, Clock } from 'lucide-react';
import { SubmissionDoc, TeacherUser } from '../types/lkpd';

interface NavbarProps {
  currentView: 'landing' | 'student' | 'teacher';
  activeSubmission: SubmissionDoc | null;
  teacher: TeacherUser | null;
  onGoHome: () => void;
  onOpenTeacherLogin: () => void;
  onLogoutTeacher: () => void;
  onExitStudentView: () => void;
  elapsedSeconds?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  activeSubmission,
  teacher,
  onGoHome,
  onOpenTeacherLogin,
  onLogoutTeacher,
  onExitStudentView,
  elapsedSeconds = 0,
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-left group focus:outline-hidden"
          title="Kembali ke Beranda"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Satellite className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-800 tracking-tight text-lg">GEOEXPLORE</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-700 rounded-md">
                KELAS X
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">LKPD Sistem Penginderaan Jauh</p>
          </div>
        </button>

        {/* Center Indicators */}
        <div className="flex items-center gap-2">
          {currentView === 'student' && activeSubmission && (
            <div className="flex items-center gap-2 bg-sky-50 border border-sky-200/80 px-3 py-1.5 rounded-full text-xs font-medium text-sky-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-bold">{activeSubmission.kelas}</span>
              <span className="text-sky-300">•</span>
              <span className="font-semibold text-sky-800">{activeSubmission.groupName}</span>
              <span className="text-sky-300 hidden md:inline">•</span>
              <span className="text-slate-600 hidden md:inline flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-600" />
                {formatTime(elapsedSeconds)} / 45m
              </span>
            </div>
          )}

          {currentView === 'teacher' && teacher && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Operator Aktif: {teacher.username}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {currentView === 'student' ? (
            <button
              onClick={onExitStudentView}
              className="text-xs px-3 py-1.5 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Ganti Kelompok</span>
            </button>
          ) : currentView === 'teacher' ? (
            <button
              onClick={onLogoutTeacher}
              className="text-xs px-3 py-1.5 font-medium text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Operator</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenTeacherLogin}
                className="text-xs font-medium px-3 py-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>Portal Guru</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
