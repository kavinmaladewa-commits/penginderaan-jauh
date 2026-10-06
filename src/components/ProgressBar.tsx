import React from 'react';
import { Check, CloudCheck, Loader2 } from 'lucide-react';

export interface StepItem {
  number: number;
  label: string;
  shortLabel: string;
}

export const STEPS: StepItem[] = [
  { number: 1, label: 'Identitas', shortLabel: 'ID' },
  { number: 2, label: 'Tujuan Pembelajaran', shortLabel: 'Tujuan' },
  { number: 3, label: 'Aktivitas 1', shortLabel: 'Akt 1' },
  { number: 4, label: 'Aktivitas 2', shortLabel: 'Akt 2' },
  { number: 5, label: 'Aktivitas 3', shortLabel: 'Akt 3' },
  { number: 6, label: 'Refleksi', shortLabel: 'Refleksi' },
  { number: 7, label: 'Exit Ticket', shortLabel: 'Exit' },
  { number: 8, label: 'Selesai', shortLabel: 'Selesai' },
];

interface ProgressBarProps {
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
  maxUnlockedStep: number;
  isSaving?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  onSelectStep,
  maxUnlockedStep,
  isSaving = false,
}) => {
  // calculate completion percentage (step 1 to 8)
  const percent = Math.min(Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100), 100);

  return (
    <div className="bg-white border-b border-sky-100 shadow-xs sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Info: Progress % and Saving Status */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">
              Langkah {currentStep} dari {STEPS.length}:
            </span>
            <span className="text-sky-700 font-semibold hidden sm:inline">
              {STEPS.find((s) => s.number === currentStep)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isSaving ? (
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tersimpan di Cloud
              </span>
            )}
            <span className="font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              {percent}% Selesai
            </span>
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Step Nodes */}
        <div className="flex items-center justify-between relative overflow-x-auto pb-1 scrollbar-none">
          {STEPS.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isClickable = step.number <= maxUnlockedStep;

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => isClickable && onSelectStep(step.number)}
                disabled={!isClickable}
                className={`flex flex-col items-center group focus:outline-hidden px-1 transition-all ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
                title={step.label}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100 scale-110 shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] mt-1 font-semibold whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-sky-800 font-bold'
                      : isCompleted
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="hidden md:inline">{step.label}</span>
                  <span className="md:hidden">{step.shortLabel}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
