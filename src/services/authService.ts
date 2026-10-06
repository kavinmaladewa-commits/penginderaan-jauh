import { TeacherUser } from '../types/lkpd';

const TEACHER_TOKEN_KEY = 'geoexplore_teacher_token';
const TEACHER_USER_KEY = 'geoexplore_teacher_user';

export async function loginTeacher(
  username: string,
  pass: string
): Promise<{ ok: boolean; message?: string; user?: TeacherUser }> {
  try {
    const res = await fetch('/api/auth/teacher-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password: pass }),
    });

    const data = await res.json();
    if (res.ok && data.ok) {
      localStorage.setItem(TEACHER_TOKEN_KEY, data.token);
      localStorage.setItem(TEACHER_USER_KEY, JSON.stringify(data.user));
      return { ok: true, user: data.user };
    }

    return { ok: false, message: data.message || 'Login gagal.' };
  } catch (error) {
    console.error('Teacher login network error:', error);
    return { ok: false, message: 'Gagal menghubungi server. Pastikan koneksi aktif.' };
  }
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
