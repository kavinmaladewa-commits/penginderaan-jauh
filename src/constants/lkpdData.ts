import { KelasType, SubmissionDoc } from '../types/lkpd';

export const KELAS_LIST: KelasType[] = [
  'X-A',
  'X-B',
  'X-C',
  'X-D',
  'X-E',
  'X-F',
  'X-G',
  'X-H',
  'X-I',
  'X-J',
];

export const GROUP_NUMBERS = [1, 2, 3, 4, 5, 6];

export const SYSTEM_COMPONENTS = [
  { id: 'sumber_energi', name: 'Sumber Energi', icon: '☀️', desc: 'Sumber tenaga dalam proses perekaman data' },
  { id: 'atmosfer', name: 'Atmosfer', icon: '🌫', desc: 'Media udara yang dilalui oleh energi gelombang' },
  { id: 'objek', name: 'Objek', icon: '🌍', desc: 'Benda, fenomena, atau wilayah permukaan bumi yang diamati' },
  { id: 'sensor', name: 'Sensor', icon: '📷', desc: 'Alat perekam atau pengindra energi yang dipantulkan/dipancarkan' },
  { id: 'wahana', name: 'Wahana', icon: '🛰', desc: 'Kendaraan pembawa sensor (satelit, pesawat, drone)' },
  { id: 'data_citra', name: 'Data/Citra', icon: '🖼', desc: 'Hasil rekaman objek berupa citra foto atau citra digital non-foto' },
  { id: 'pengguna_data', name: 'Pengguna Data', icon: '👥', desc: 'Pihak/institusi yang memanfaatkan informasi untuk analisis & kebijakan' },
];

export const EXAMPLE_OPTIONS = [
  'Matahari',
  'Udara/Atmosfer',
  'Sungai/Hutan/Permukaan Bumi',
  'Kamera Sensor Satelit',
  'Drone/Pesawat/Satelit',
  'Citra Satelit/Foto Udara',
  'Peneliti/Pemerintah (BNPB/BMKG)',
];

export const INITIAL_ACTIVITY_2_CASES = [
  {
    id: 1,
    scenario: 'Sensor kamera optik menggunakan pantulan cahaya Matahari dari permukaan bumi pada siang hari.',
    choice: '' as const,
    reason: '',
  },
  {
    id: 2,
    scenario: 'Radar memancarkan gelombang mikro sendiri dari wahana dan merekam gelombang yang dipantulkan kembali oleh objek bumi.',
    choice: '' as const,
    reason: '',
  },
  {
    id: 3,
    scenario: 'Foto udara konvensional dari pesawat terbang memanfaatkan keterlihatan visual dari terangnya sinar matahari.',
    choice: '' as const,
    reason: '',
  },
  {
    id: 4,
    scenario: 'Sensor mengirim pulsa laser (LiDAR) secara mandiri untuk mengukur jarak ketinggian permukaan dan kerapatan vegetasi.',
    choice: '' as const,
    reason: '',
  },
  {
    id: 5,
    scenario: 'Perekaman citra satelit multispektral sangat bergantung pada intensitas pencahayaan alami dari energi matahari.',
    choice: '' as const,
    reason: '',
  },
  {
    id: 6,
    scenario: 'Sensor gelombang mikro tetap dapat bekerja merekam permukaan bumi pada malam hari tanpa bantuan sinar matahari.',
    choice: '' as const,
    reason: '',
  },
];

export const DETECTIVE_OBJECTS = [
  {
    id: 'objekA',
    label: 'Objek A',
    characteristics: [
      'Rona: Hijau cerah / hijau tua seragam',
      'Pola: Petak-petak kotak teratur dibatasi pematang',
      'Tekstur: Halus hingga sedang',
      'Situs: Daerah dataran rendah dan dekat saluran irigasi',
    ],
    correctAnswer: 'Sawah',
  },
  {
    id: 'objekB',
    label: 'Objek B',
    characteristics: [
      'Rona: Gelap / hitam kebiruan menyerap sinar matahari',
      'Bentuk: Memanjang berkelok-kelok (meandering)',
      'Ukuran: Lebar bervariasi dari hulu ke hilir',
      'Tekstur: Halus seragam',
    ],
    correctAnswer: 'Sungai',
  },
  {
    id: 'objekC',
    label: 'Objek C',
    characteristics: [
      'Rona: Cerah / abu-abu kontras dengan sekitar',
      'Bentuk: Garis lurus atau lengkung berpola teratur',
      'Ukuran: Lebar konstan dari ujung ke ujung',
      'Asosiasi: Menghubungkan titik permukiman satu dengan lainnya',
    ],
    correctAnswer: 'Jalan',
  },
  {
    id: 'objekD',
    label: 'Objek D',
    characteristics: [
      'Rona: Heterogen / bervariasi (atap genteng merah, abu-abu)',
      'Pola: Mengelompok padat dan teratur',
      'Tekstur: Kasar',
      'Asosiasi: Memiliki akses langsung ke jaringan jalan',
    ],
    correctAnswer: 'Permukiman',
  },
];

export const OBJECT_OPTIONS = ['Sawah', 'Sungai', 'Jalan', 'Permukiman'];

export function createEmptySubmission(kelas: KelasType, groupNumber: number, groupName: string, members: string[]): SubmissionDoc {
  const id = `${kelas}_kelompok_${groupNumber}`;
  const now = new Date().toISOString();

  const componentTable: Record<string, { fungsi: string; contoh: string }> = {};
  SYSTEM_COMPONENTS.forEach((c) => {
    componentTable[c.name] = { fungsi: '', contoh: '' };
  });

  return {
    id,
    kelas,
    groupNumber,
    groupName: groupName.trim() || `Kelompok ${groupNumber}`,
    members: members.filter((m) => m.trim().length > 0),
    status: 'sedang_mengerjakan',
    currentStep: 2, // Step 1 is Identitas (done), starts at 2 (Tujuan)
    progressPercent: 15,
    lastActiveSection: 'Tujuan Pembelajaran',
    activity1: {
      caseStudyAnswer: '',
      independentEssay: '',
      // Default initial order (scrambled intentionally to let students order)
      componentOrder: [
        'Atmosfer',
        'Sumber Energi',
        'Sensor',
        'Objek',
        'Data/Citra',
        'Wahana',
        'Pengguna Data',
      ],
      exampleMatches: {},
      componentTable,
    },
    activity2: {
      cases: INITIAL_ACTIVITY_2_CASES.map((c) => ({ ...c })),
    },
    activity3: {
      identifications: {
        objekA: '',
        objekB: '',
        objekC: '',
        objekD: '',
      },
      caseStudy: {
        question1: '',
        question2: '',
      },
      independentEssay: '',
    },
    reflection: {
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      independentEssay: '',
    },
    exitTicket: {
      q1: '',
      q2: '',
      q3: '',
      q4: '',
    },
    startedAt: now,
    updatedAt: now,
  };
}

export function createResetSubmission(
  kelas: KelasType,
  groupNumber: number,
  groupName?: string,
  members?: string[]
): SubmissionDoc {
  const base = createEmptySubmission(
    kelas,
    groupNumber,
    groupName || `Kelompok ${groupNumber}`,
    members || []
  );
  delete (base as any).score;
  delete (base as any).submittedAt;
  return {
    ...base,
    status: 'belum_mulai',
    currentStep: 1,
    progressPercent: 0,
    lastActiveSection: 'Belum Mulai',
  };
}
