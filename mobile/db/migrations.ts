export const INITIAL_SCHEMA_SQL = `
-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  level TEXT NOT NULL DEFAULT 'B1',
  goal TEXT NOT NULL DEFAULT 'Everyday conversation',
  daily_goal_minutes INTEGER NOT NULL DEFAULT 15,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  level TEXT NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  duration INTEGER NOT NULL DEFAULT 0,
  messages_count INTEGER NOT NULL DEFAULT 0,
  mistakes_count INTEGER NOT NULL DEFAULT 0
);

-- 3. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
  text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
);

-- 4. Corrections Table
CREATE TABLE IF NOT EXISTS corrections (
  id TEXT PRIMARY KEY,
  message_id TEXT,
  session_id TEXT,
  original TEXT NOT NULL,
  corrected TEXT NOT NULL,
  explanation TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('grammar', 'vocabulary', 'pronunciation', 'naturalness')),
  severity TEXT NOT NULL CHECK(severity IN ('minor', 'moderate', 'important')),
  created_at TEXT NOT NULL,
  FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE SET NULL,
  FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
);

-- 5. Vocabulary Table
CREATE TABLE IF NOT EXISTS vocabulary (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  meaning TEXT NOT NULL,
  example TEXT NOT NULL,
  source TEXT,
  learned INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- 6. Progress Table
CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  speaking_minutes INTEGER NOT NULL DEFAULT 0,
  sessions_completed INTEGER NOT NULL DEFAULT 0,
  mistakes_count INTEGER NOT NULL DEFAULT 0,
  words_learned INTEGER NOT NULL DEFAULT 0,
  grammar_score INTEGER NOT NULL DEFAULT 80,
  vocabulary_score INTEGER NOT NULL DEFAULT 80,
  pronunciation_score INTEGER NOT NULL DEFAULT 80,
  fluency_score INTEGER NOT NULL DEFAULT 80
);

-- 7. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_corrections_session_id ON corrections(session_id);
CREATE INDEX IF NOT EXISTS idx_progress_date ON progress(date);
`;
