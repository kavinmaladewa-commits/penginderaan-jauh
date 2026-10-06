export type KelasType =
  | 'X-A'
  | 'X-B'
  | 'X-C'
  | 'X-D'
  | 'X-E'
  | 'X-F'
  | 'X-G'
  | 'X-H'
  | 'X-I'
  | 'X-J';

export type GroupStatus =
  | 'belum_mulai'
  | 'sedang_mengerjakan'
  | 'sudah_mengumpulkan'
  | 'sudah_dinilai';

export interface Activity1Data {
  caseStudyAnswer: string;
  componentOrder: string[];
  exampleMatches: Record<string, string>;
  componentTable: Record<string, { fungsi: string; contoh: string }>;
  independentEssay?: string;
}

export interface Activity2Case {
  id: number;
  scenario: string;
  choice: 'Aktif' | 'Pasif' | '';
  reason: string;
}

export interface Activity3Data {
  identifications: {
    objekA: string; // Sawah
    objekB: string; // Sungai
    objekC: string; // Jalan
    objekD: string; // Permukiman
  };
  caseStudy: {
    question1: string;
    question2: string;
  };
  independentEssay?: string;
}

export interface ReflectionData {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  independentEssay?: string;
}

export interface ExitTicketData {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

export interface GradingScore {
  activity1: number; // max 40
  activity2: number; // max 30
  activity3: number; // max 20
  reflection: number; // max 10
  total: number; // max 100
  feedback: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface SubmissionDoc {
  id: string; // e.g., "X-A_kelompok_1"
  kelas: KelasType;
  groupNumber: number; // 1 to 6
  groupName: string;
  members: string[]; // 1 to 6 members
  status: GroupStatus;
  currentStep: number;
  progressPercent: number;
  lastActiveSection: string;
  activity1: Activity1Data;
  activity2: {
    cases: Activity2Case[];
  };
  activity3: Activity3Data;
  reflection: ReflectionData;
  exitTicket: ExitTicketData;
  score?: GradingScore;
  startedAt: string;
  submittedAt?: string;
  updatedAt: string;
}

export interface TeacherUser {
  username: string;
  role: 'operator';
  name: string;
}
