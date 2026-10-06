import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Server-side teacher credentials - NEVER exposed to the frontend bundle
const TEACHER_USERNAME = process.env.TEACHER_USERNAME || 'pjsmandasa';
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'geografi 10';

// In-memory or simple signed session token storage
const activeSessions = new Set<string>();

function generateToken(): string {
  return 'teacher_session_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Teacher Authentication API
app.post('/api/auth/teacher-login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'Username dan password wajib diisi.' });
  }

  // Exact comparison
  if (username.trim() === TEACHER_USERNAME && password === TEACHER_PASSWORD) {
    const token = generateToken();
    activeSessions.add(token);

    return res.json({
      ok: true,
      token,
      user: {
        username: TEACHER_USERNAME,
        role: 'operator',
        name: 'Guru Geografi (Operator SMANDASA)',
      },
    });
  }

  return res.status(401).json({
    ok: false,
    message: 'Username atau password operator salah. Silakan periksa kembali!',
  });
});

app.post('/api/auth/verify-teacher', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token && activeSessions.has(token)) {
    return res.json({
      ok: true,
      user: {
        username: TEACHER_USERNAME,
        role: 'operator',
        name: 'Guru Geografi (Operator SMANDASA)',
      },
    });
  }

  return res.status(401).json({ ok: false, message: 'Sesi operator tidak valid atau telah berakhir.' });
});

app.post('/api/auth/teacher-logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (token) {
    activeSessions.delete(token);
  }
  return res.json({ ok: true, message: 'Berhasil logout.' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GEOEXPLORE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
