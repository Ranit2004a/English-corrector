# Echo — AI English Speaking Coach Mobile App

An AI English Speaking Coach mobile application and FastAPI backend.

Echo acts as a friendly, patient speaking partner that listens to your spoken English, engages in natural back-and-forth conversation, silently analyzes your grammar and vocabulary, and provides concise, constructive feedback without turning conversations into boring grammar lectures.

---

## Architecture

```text
React Native / Expo Mobile App (Local-First)
 ├── App Navigation (Expo Router with Tab & Stack navigation)
 ├── Design System (Editorial Monolith Monochrome Theme)
 ├── State Layer (Zustand stores + TanStack Query)
 ├── Local Database (expo-sqlite with Migrations & Repositories)
 ├── Voice Services (expo-speech TTS + STT voice capture)
 └── API Client (Axios / Fetch with error handling)
       │
       ▼
 FastAPI Backend (Python)
 ├── REST API Endpoints (/conversation, /analyze, /topics, /feedback)
 ├── Gemini Service (Structured JSON output mode, Pydantic validation)
 └── Level-adaptive Prompt Engine (A1-C2)
```

---

## Key Features

1. **Local-First SQLite Database**: All sessions, conversation messages, mistake history, vocabulary items, and daily progress metrics are stored locally on the device using `expo-sqlite`. No cloud databases (no Supabase, Firebase, or cloud dependencies).
2. **Secure AI Backend with Gemini**: Gemini API key is kept exclusively on the FastAPI backend.
3. **Editorial Monolith Aesthetic**: Built using the monochrome, Swiss typography design system from `prototype/DESIGN.md` (Hanken Grotesk typography, discrete card surfaces, tactile mic button, and audio rhythm bars).
4. **Natural Spoken Interaction Flow**: `SPEAK → LISTEN → AI THINKS → AI RESPONDS → GET FEEDBACK → SPEAK AGAIN`.
5. **CEFR Level Adaptive**: Tailors sentence complexity, question depth, and correction sensitivity for Beginner (A1/A2), Intermediate (B1/B2), and Advanced (C1/C2) learners.
6. **Constructive Feedback & Top Fix**: Highlights genuine mistakes only, provides simple 1-sentence explanations with category and severity badges, and gives an actionable "Top thing to improve".
7. **Progress Tracking**: Daily speaking minutes, streak calculation, skill scores (Grammar, Vocabulary, Fluency), and mistake distribution by category.
8. **Vocabulary Bank**: Automatically discovers and saves vocabulary words used in conversation with audio pronunciation and mastery toggle.

---

## Quick Start Guide

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create and activate virtual environment (optional)
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env and set your GEMINI_API_KEY
cp .env.example .env

# Run automated tests
python test_api.py

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Mobile App Setup (Expo React Native)

```bash
cd mobile

# Install dependencies
npm install

# Typecheck
npx tsc --noEmit

# Start Expo dev server
npx expo start
```

Press `w` to open in a web browser, `a` for Android emulator, or scan the QR code with the Expo Go app on your physical device.

---

## API Endpoints

- `GET /health` — Backend health status & Gemini configuration check.
- `GET /api/topics` — Categorized speaking practice topics (Everyday, Professional, Advanced, Free Conversation).
- `POST /api/conversation/message` — Primary conversational exchange endpoint with structured JSON output:
  - `reply` (1-3 natural conversational sentences + follow-up question)
  - `corrections` (original, corrected, explanation, category, severity)
  - `top_fix` (primary takeaway rule)
  - `encouragement` (friendly reinforcement)
- `POST /api/conversation/session` — Session summary evaluator calculating grammar, vocabulary, and fluency scores.
- `POST /api/conversation/analyze` — Text snippet grammar & phrasing analysis.
- `POST /api/feedback` — Standalone correction analysis.

---

## Local Database Schema (`expo-sqlite`)

1. `users` — User profile, target CEFR level, learning goal, daily speaking target.
2. `sessions` — Practice session history, duration in seconds, message count, mistake count.
3. `messages` — Spoken conversation exchanges (`user` and `assistant`).
4. `corrections` — Identified mistakes, original phrasing, corrected version, explanation, category, and severity.
5. `vocabulary` — Collected vocabulary words, definitions, contextual examples, and learned status.
6. `progress` — Daily speaking minutes, completed sessions, streak tracking, and skill scores.
7. `settings` — App configuration (speech rate, auto-play, backend endpoint, theme).
