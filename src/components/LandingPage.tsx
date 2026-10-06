import React from 'react';
import {
  Satellite,
  Globe2,
  Layers,
  GraduationCap,
  ShieldCheck,
  Clock,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Database,
  Radio,
} from 'lucide-react';

interface LandingPageProps {
  onStartStudent: () => void;
  onOpenTeacherLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartStudent,
  onOpenTeacherLogin,
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-sky-50 via-sky-50/60 to-white flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brief and Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Subject Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 border border-sky-200 text-sky-800 text-xs font-semibold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Geografi Kelas X</span>
              <span className="text-sky-300">•</span>
              <span>Pertemuan 1</span>
              <span className="text-sky-300">•</span>
              <span className="text-amber-700 flex items-center gap-1 font-bold">
                <Clock className="w-3 h-3 text-amber-500" /> 1 JP (45 Menit)
              </span>
            </div>

            {/* Main Titles */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-widest text-sky-600 uppercase">
                  🌍 GEOEXPLORE
                </span>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 rounded-md">
                  Digital LKPD
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                LKPD SISTEM <br />
                <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  PENGINDERAAN JAUH
                </span>
              </h1>
              <p className="text-base sm:text-lg font-medium text-slate-700">
                Penginderaan Jauh: Mata dari Angkasa
              </p>
            </div>

            {/* Exact Quote Description as per Prompt */}
            <div className="p-4 sm:p-5 bg-white/90 rounded-2xl border border-sky-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sky-500 to-emerald-500" />
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed italic">
                &ldquo;Melalui LKPD ini, peserta didik akan mempelajari bagaimana teknologi penginderaan jauh digunakan untuk memperoleh informasi mengenai permukaan bumi melalui sensor tanpa melakukan kontak langsung dengan objek.&rdquo;
              </p>
            </div>

            {/* Two Action Buttons Requested */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStartStudent}
                className="group flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-bold text-base shadow-lg shadow-sky-600/25 hover:shadow-sky-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="text-xl">👨‍🎓</span>
                <div className="text-left">
                  <div className="font-extrabold tracking-wide text-sm sm:text-base">
                    MASUK SEBAGAI SISWA
                  </div>
                  <div className="text-[11px] text-sky-100 font-normal">
                    Untuk mengerjakan LKPD Kelompok
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto text-sky-200 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenTeacherLogin}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-emerald-500 text-slate-800 font-bold text-base shadow-sm hover:shadow-md transition-all group"
              >
                <span className="text-xl">👨‍🏫</span>
                <div className="text-left">
                  <div className="font-extrabold tracking-wide text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                    MASUK SEBAGAI OPERATOR/GURU
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Untuk monitoring dan penilaian real-time
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 ml-auto text-emerald-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Badges Info */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white/70 rounded-xl border border-sky-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">10 Kelas</div>
                  <div className="text-[10px] text-slate-500">Kelas X-A s/d X-J</div>
                </div>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-sky-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">6 Kelompok</div>
                  <div className="text-[10px] text-slate-500">Kolaboratif per kelas</div>
                </div>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-sky-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Real-Time</div>
                  <div className="text-[10px] text-slate-500">Sinkron Firestore</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Graphic (Earth, Satellite, Scan Ray, Surface Imagery) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square bg-gradient-to-b from-sky-900 via-indigo-950 to-slate-900 rounded-3xl p-6 shadow-2xl border-4 border-white/80 overflow-hidden flex flex-col justify-between text-white">
              
              {/* Star dots */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Top: Orbiting Satellite Indicator */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Satelit Sentinel-2 Orbit: 786 km</span>
                </div>
                <span className="text-[11px] font-mono text-sky-300">SENSOR AKTIF/PASIF</span>
              </div>

              {/* Graphic Representation: Satellite shooting electromagnetic waves to Earth */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                {/* Satellite */}
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/40 border border-white/40 animate-bounce" style={{ animationDuration: '3s' }}>
                    <Satellite className="w-8 h-8 text-white" />
                  </div>
                  {/* Solar Panels */}
                  <div className="absolute -left-4 top-5 w-4 h-6 bg-cyan-300/80 rounded-sm border border-white/40" />
                  <div className="absolute -right-4 top-5 w-4 h-6 bg-cyan-300/80 rounded-sm border border-white/40" />
                </div>

                {/* Scanning Radar Beam (Cone) */}
                <div className="w-48 h-28 relative overflow-hidden pointer-events-none -mt-1">
                  <div className="w-full h-full bg-gradient-to-b from-cyan-400/50 via-emerald-400/20 to-transparent [clip-path:polygon(50%_0%,100%_100%,0%_100%)] animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-200 tracking-wider bg-black/40 px-2 py-0.5 rounded-sm">
                    Perekaman Sensor Spektral
                  </div>
                </div>

                {/* Earth Globe Arc & Surface Imagery */}
                <div className="relative w-72 h-36 rounded-t-full bg-gradient-to-b from-sky-500 via-teal-600 to-emerald-800 border-t-2 border-cyan-200 shadow-inner overflow-hidden flex flex-col items-center justify-center p-3 text-center">
                  {/* Continents graphic texture */}
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:12px_12px]" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white mb-0.5">
                      <Globe2 className="w-4 h-4 text-cyan-200" />
                      <span>Permukaan Bumi (Objek)</span>
                    </div>
                    <div className="flex justify-center gap-1.5 text-[10px] font-mono text-emerald-100">
                      <span className="bg-emerald-950/40 px-1.5 py-0.5 rounded">Hutan</span>
                      <span className="bg-sky-950/40 px-1.5 py-0.5 rounded">Sungai</span>
                      <span className="bg-amber-950/40 px-1.5 py-0.5 rounded">Sawah</span>
                      <span className="bg-rose-950/40 px-1.5 py-0.5 rounded">Kota</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Resulting Imagery Box */}
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center border border-emerald-400/30">
                    <Layers className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">Citra Resolusi Tinggi</div>
                    <div className="text-[10px] text-slate-300">Data Siap Dianalisis Siswa</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-2 py-1 rounded-md">
                  <Sparkles className="w-3 h-3" /> Siap Eksplorasi
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Footer Info */}
      <footer className="border-t border-sky-100 bg-white/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SMA Negeri • Mata Pelajaran Geografi Kelas X • Kurikulum Merdeka</span>
          <span className="font-medium text-slate-600">
            Sistem Informasi Geografis & Penginderaan Jauh • Digital Worksheet
          </span>
        </div>
      </footer>
    </div>
  );
};
