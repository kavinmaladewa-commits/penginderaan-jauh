import { TeacherUser } from '../types/lkpd';
import { auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';

const TEACHER_TOKEN_KEY = 'geoexplore_teacher_token';
const TEACHER_USER_KEY = 'geoexplore_teacher_user';

// Cryptographic hash of authorized credentials ('username:password')
// Plaintext password is NEVER stored in frontend code.
const EXPECTED_CREDENTIALS_HASH =
  '97e0e94085a33142ccaab7d9b76b78772d622934dcd930b2de25cbc7593acb28';

async function computeSha256(str: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return '';
  }
}

export async function loginTeacher(
  username: string,
  pass: string
): Promise<{ ok: boolean; message?: string; user?: TeacherUser }> {
  const cleanUsername = username.trim();
  const cleanPass = pass;

  if (!cleanUsername || !cleanPass) {
    return { ok: false, message: 'Username dan password wajib diisi.' };
  }

  // Ensure Firebase Auth session is active
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth).catch(() => {});
    }
  } catch {
    // Continue even if anonymous sign-in is disabled
  }

  // 1. Try server-side authentication API first
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('/api/auth/teacher-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: cleanUsername, password: cleanPass }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (res.ok && data.ok) {
        localStorage.setItem(TEACHER_TOKEN_KEY, data.token);
        localStorage.setItem(TEACHER_USER_KEY, JSON.stringify(data.user));
        return { ok: true, user: data.user };
      }
      if (res.status === 401 || (data && !data.ok)) {
        return { ok: false, message: data.message || 'Username atau password operator salah.' };
      }
    }
  } catch (error) {
    console.warn('Server auth endpoint unavailable or timed out, evaluating secure cryptographic hash fallback...', error);
  }

  // 2. Cryptographic one-way hash validation fallback
  // Ensures teacher can always login even if backend server process is reloading
  const calculatedHash = await computeSha256(`${cleanUsername}:${cleanPass}`);
  if (calculatedHash && calculatedHash === EXPECTED_CREDENTIALS_HASH) {
    const teacherUser: TeacherUser = {
      username: cleanUsername,
      role: 'operator',
      name: 'Guru Geografi (Operator SMANDASA)',
    };
    const localToken = 'local_op_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem(TEACHER_TOKEN_KEY, localToken);
    localStorage.setItem(TEACHER_USER_KEY, JSON.stringify(teacherUser));
    return { ok: true, user: teacherUser };
  }

  return {
    ok: false,
    message: 'Username atau password operator salah. Silakan periksa kembali!',
  };
}

export function getStoredTeacher(): TeacherUser | null {
  const token = localStorage.getItem(TEACHER_TOKEN_KEY);
  const userJson = localStorage.getItem(TEACHER_USER_KEY);
  if (!token || !userJson) return null;
  try {
    return JSON.parse(userJson) as TeacherUser;
  } catch {
    return null;
  }
}

export function logoutTeacher(): void {
  const token = localStorage.getItem(TEACHER_TOKEN_KEY);
  if (token) {
    fetch('/api/auth/teacher-logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {});
  }
  localStorage.removeItem(TEACHER_TOKEN_KEY);
  localStorage.removeItem(TEACHER_USER_KEY);
}
