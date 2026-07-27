import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
dotenv.config();

const required = (name: string, fallback?: string) => {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.API_PORT || process.env.PORT || 4000),
  frontendUrl: process.env.FRONTEND_URL || 'http://127.0.0.1:3000',
  jwtSecret: required('JWT_SECRET', 'development-only-change-before-deployment'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  dbDumpBinary: process.env.DB_DUMP_BINARY || 'mysqldump',
  archiveBinary: process.env.ARCHIVE_BINARY || 'tar',
  clamScanBinary: process.env.CLAMDSCAN_BINARY,
  requireCleanUploads: process.env.REQUIRE_CLEAN_UPLOADS === 'true' || process.env.NODE_ENV === 'production',
  workersEnabled: process.env.WORKERS_ENABLED === 'true',
  speech: {
    provider: process.env.SPEECH_PROVIDER || 'disabled',
    apiKey: process.env.SPEECH_API_KEY || process.env.OPENAI_API_KEY || '',
    baseUrl: (process.env.SPEECH_API_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/,''),
    transcriptionModel: process.env.SPEECH_TRANSCRIPTION_MODEL || 'gpt-4o-mini-transcribe',
    translationModel: process.env.SPEECH_TRANSLATION_MODEL || 'whisper-1',
    synthesisModel: process.env.SPEECH_SYNTHESIS_MODEL || 'gpt-4o-mini-tts',
    voice: process.env.SPEECH_VOICE || 'coral',
  },
  workerIntervalMs: Math.max(30_000, Number(process.env.WORKER_INTERVAL_MS || 60_000)),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3308),
    database: process.env.DB_DATABASE || 'ecoclean_2000plus',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
  },
};
