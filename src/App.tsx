import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentIdentityModal } from './components/StudentIdentityModal';
import { ProgressBar } from './components/ProgressBar';
import { LearningObjectives } from './components/LearningObjectives';
import { Activity1 } from './components/Activity1';
import { Activity2 } from './components/Activity2';
import { Activity3 } from './components/Activity3';
import { ReflectionSection } from './components/ReflectionSection';
import { ExitTicketSection } from './components/ExitTicketSection';
import { CompletedView } from './components/CompletedView';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SubmissionDoc, TeacherUser, Activity1Data, Activity2Case, Activity3Data, ReflectionData, ExitTicketData } from './types/lkpd';
import { saveSubmission, submitFinalSubmission, listenToSubmission } from './services/submissionService';
import { getStoredTeacher, logoutTeacher } from './services/authService';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'student' | 'teacher'>('landing');
  const [activeSubmission, setActiveSubmission] = useState<SubmissionDoc | null>(null);
  const [activeStep, setActiveStep] = useState<number>(2);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(2);
  const [teacher, setTeacher] = useState<TeacherUser | null>(getStoredTeacher());

  // Modals
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);

  // Auto-saving state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [submitSuccessToast, setSubmitSuccessToast] = useState<boolean>(false);
  const [resetNotice, setResetNotice] = useState<string>('');

  // 45 minutes session stopwatch
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Timer effect for student session
  useEffect(() => {
    let interval: any = null;
    if (currentView === 'student' && activeSubmission && activeSubmission.status !== 'sudah_mengumpulkan' && activeSubmission.status !== 'sudah_dinilai') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentView, activeSubmission?.status]);

  // Real-time listener for current student submission (syncs teacher grades, reopen, or reset)
  useEffect(() => {
    if (!activeSubmission?.id) return;

    const unsub = listenToSubmission(activeSubmission.id, (updated) => {
      if (updated) {
        setActiveSubmission((prev) => {
          if (!prev) return updated;
          return {
            ...prev,
            status: updated.status,
            score: updated.score,
            submittedAt: updated.submittedAt,
            // If submission was reopened, update step
            currentStep: updated.currentStep,
          };
        });

        if (updated.status === 'sudah_mengumpulkan' || updated.status === 'sudah_dinilai') {
          setActiveStep(8);
          setMaxUnlockedStep(8);
        }
      } else {
        // The teacher reset/deleted this submission!
        // Immediately reset student session so no cached answers remain
        setActiveSubmission(null);
        setCurrentView('landing');
        setActiveStep(2);
        setMaxUnlockedStep(2);
        setElapsedSeconds(0);
        setResetNotice(
          'Aktivitas kelompok Anda telah di-reset oleh guru/operator. Seluruh jawaban telah dikosongkan dan data pengerjaan telah dihapus.'
        );
        setTimeout(() => setResetNotice(''), 7000);
      }
    });

    return () => unsub();
  }, [activeSubmission?.id]);

  // Handle student starting session
  const handleStartStudentSession = (sub: SubmissionDoc) => {
    setActiveSubmission(sub);
    setIsStudentModalOpen(false);
    setCurrentView('student');

    if (sub.status === 'sudah_mengumpulkan' || sub.status === 'sudah_dinilai') {
      setActiveStep(8);
      setMaxUnlockedStep(8);
    } else {
      const step = Math.max(2, sub.currentStep || 2);
      setActiveStep(step);
      setMaxUnlockedStep(Math.max(step, maxUnlockedStep));
    }
  };

  // Helper to persist changes to Firestore with debounce
  const persistChanges = async (updated: SubmissionDoc) => {
    setIsSaving(true);
    setActiveSubmission(updated);
    try {
      await saveSubmission(updated);
    } catch (err) {
      console.error('Failed to save to database:', err);
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  // Step changes & navigation
  const goToStep = (stepNumber: number) => {
    if (!activeSubmission) return;
    setActiveStep(stepNumber);
    // When reaching step 7 or beyond, immediately unlock step 8 so student can freely view Selesai tab
    const targetUnlock = stepNumber >= 7 ? 8 : stepNumber;
    if (targetUnlock > maxUnlockedStep) {
      setMaxUnlockedStep(targetUnlock);
    }

    // Step labels for monitoring
    const stepNames: Record<number, string> = {
      2: 'Tujuan Pembelajaran',
      3: 'Aktivitas 1: Susun Sistem',
      4: 'Aktivitas 2: Aktif atau Pasif',
      5: 'Aktivitas 3: Detektif Citra',
      6: 'Refleksi Pembelajaran',
      7: 'Exit Ticket',
      8: 'Selesai',
    };

    const percent = Math.min(Math.round(((stepNumber - 1) / 7) * 100), 100);

    const updated: SubmissionDoc = {
      ...activeSubmission,
      currentStep: stepNumber,
      progressPercent: Math.max(activeSubmission.progressPercent, percent),
      lastActiveSection: stepNames[stepNumber] || `Langkah ${stepNumber}`,
    };
    persistChanges(updated);
  };

  // Handlers for activity data changes
  const handleActivity1Change = (newAct1: Activity1Data) => {
    if (!activeSubmission) return;
    const updated = {
      ...activeSubmission,
      activity1: newAct1,
    };
    persistChanges(updated);
  };

  const handleActivity2Change = (newCases: Activity2Case[]) => {
    if (!activeSubmission) return;
    const updated = {
      ...activeSubmission,
      activity2: {
        cases: newCases,
      },
    };
    persistChanges(updated);
  };

  const handleActivity3Change = (newAct3: Activity3Data) => {
    if (!activeSubmission) return;
    const updated = {
      ...activeSubmission,
      activity3: newAct3,
    };
    persistChanges(updated);
  };

  const handleReflectionChange = (newRef: ReflectionData) => {
    if (!activeSubmission) return;
    const updated = {
      ...activeSubmission,
      reflection: newRef,
    };
    persistChanges(updated);
  };

  const handleExitTicketChange = (newExit: ExitTicketData) => {
    if (!activeSubmission) return;
    const updated = {
      ...activeSubmission,
      exitTicket: newExit,
    };
    persistChanges(updated);
  };

  // Submit Final
  const handleSubmitFinal = async () => {
    if (!activeSubmission) return;
    setIsSaving(true);
    const finalSub: SubmissionDoc = {
      ...activeSubmission,
      status: 'sudah_mengumpulkan',
      progressPercent: 100,
      currentStep: 8,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update state immediately for instant feedback
    setActiveSubmission(finalSub);
    setActiveStep(8);
    setMaxUnlockedStep(8);

    try {
      await submitFinalSubmission(finalSub);
      setSubmitSuccessToast(true);
      setTimeout(() => setSubmitSuccessToast(false), 5000);
    } catch (err) {
      console.error('Final submission failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Is worksheet read only?
  const isWorksheetReadOnly =
    activeSubmission?.status === 'sudah_mengumpulkan' ||
    activeSubmission?.status === 'sudah_dinilai';

  return (
    <div className="min-h-screen bg-sky-50/50 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-200">
      
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        activeSubmission={activeSubmission}
        teacher={teacher}
        onGoHome={() => setCurrentView('landing')}
        onOpenTeacherLogin={() => setIsTeacherModalOpen(true)}
        onLogoutTeacher={() => {
          logoutTeacher();
          setTeacher(null);
          setCurrentView('landing');
        }}
        onExitStudentView={() => {
          setIsStudentModalOpen(true);
        }}
        elapsedSeconds={elapsedSeconds}
      />

      {/* Toast Notification: Jawaban Berhasil Dikirim */}
      {submitSuccessToast && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="text-xl">✅</span>
          <div>
            <p className="font-extrabold text-sm">Jawaban Berhasil Dikirim!</p>
            <p className="text-xs text-emerald-100">
              Data pengerjaan LKPD telah tersimpan di database guru.
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification: Pengerjaan di-reset oleh guru */}
      {resetNotice && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-rose-600 text-white rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 max-w-md">
          <span className="text-xl">🔄</span>
          <div>
            <p className="font-extrabold text-sm">Aktivitas Telah Di-Reset</p>
            <p className="text-xs text-rose-100">
              {resetNotice}
            </p>
          </div>
        </div>
      )}

      {/* Main Content Areas */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartStudent={() => setIsStudentModalOpen(true)}
            onOpenTeacherLogin={() => {
              if (teacher) {
                setCurrentView('teacher');
              } else {
                setIsTeacherModalOpen(true);
              }
            }}
          />
        )}

        {currentView === 'teacher' && teacher && (
          <TeacherDashboard
            teacher={teacher}
            onLogout={() => {
              logoutTeacher();
              setTeacher(null);
              setCurrentView('landing');
            }}
          />
        )}

        {currentView === 'student' && activeSubmission && (
          <div>
            {/* Top Progress Bar */}
            <ProgressBar
              currentStep={activeStep}
              onSelectStep={(num) => goToStep(num)}
              maxUnlockedStep={maxUnlockedStep}
              isSaving={isSaving}
            />

            {/* Student Step Content Container */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Step 2: Tujuan Pembelajaran & Ingat Kembali */}
              {activeStep === 2 && (
                <LearningObjectives onContinue={() => goToStep(3)} />
              )}

              {/* Step 3: Aktivitas 1 (Susun Sistem) */}
              {activeStep === 3 && (
                <Activity1
                  data={activeSubmission.activity1}
                  onChange={handleActivity1Change}
                  onSave={() => persistChanges(activeSubmission)}
                  onNext={() => goToStep(4)}
                  isReadOnly={isWorksheetReadOnly}
                />
              )}

              {/* Step 4: Aktivitas 2 (Aktif atau Pasif?) */}
              {activeStep === 4 && (
                <Activity2
                  cases={activeSubmission.activity2.cases}
                  onChange={handleActivity2Change}
                  onSave={() => persistChanges(activeSubmission)}
                  onNext={() => goToStep(5)}
                  onBack={() => goToStep(3)}
                  isReadOnly={isWorksheetReadOnly}
                />
              )}

              {/* Step 5: Aktivitas 3 (Detektif Citra & Manfaat) */}
              {activeStep === 5 && (
                <Activity3
                  data={activeSubmission.activity3}
                  onChange={handleActivity3Change}
                  onSave={() => persistChanges(activeSubmission)}
                  onNext={() => goToStep(6)}
                  onBack={() => goToStep(4)}
                  isReadOnly={isWorksheetReadOnly}
                />
              )}

              {/* Step 6: Refleksi Pembelajaran */}
              {activeStep === 6 && (
                <ReflectionSection
                  data={activeSubmission.reflection}
                  onChange={handleReflectionChange}
                  onSave={() => persistChanges(activeSubmission)}
                  onNext={() => goToStep(7)}
                  onBack={() => goToStep(5)}
                  isReadOnly={isWorksheetReadOnly}
                />
              )}

              {/* Step 7: Exit Ticket */}
              {activeStep === 7 && (
                <ExitTicketSection
                  data={activeSubmission.exitTicket}
                  onChange={handleExitTicketChange}
                  onSave={() => persistChanges(activeSubmission)}
                  onSubmitFinal={handleSubmitFinal}
                  onNextToFinish={() => goToStep(8)}
                  onBack={() => goToStep(6)}
                  isReadOnly={isWorksheetReadOnly}
                />
              )}

              {/* Step 8: Selesai / Tinjauan Jawaban */}
              {activeStep === 8 && (
                <CompletedView
                  submission={activeSubmission}
                  onEditRequest={() => goToStep(3)}
                  onReviewSection={(stepNum) => goToStep(stepNum)}
                  onSubmitFinal={handleSubmitFinal}
                />
              )}

            </div>
          </div>
        )}
      </main>

      {/* Student Identity Modal */}
      <StudentIdentityModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onStartSession={handleStartStudentSession}
      />

      {/* Teacher Login Modal */}
      <TeacherLoginModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onLoginSuccess={(user) => {
          setTeacher(user);
          setCurrentView('teacher');
        }}
      />

    </div>
  );
}
