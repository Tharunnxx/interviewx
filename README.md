# InterviewX

**An AI-powered, voice-driven mock interview platform** that generates personalized technical interview questions in real time, conducts the interview entirely through voice, and produces structured, AI-evaluated feedback on candidate performance.

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Google%20Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Deepgram-STT-13EF93?logoColor=black" alt="Deepgram" />
  <img src="https://img.shields.io/badge/status-in%20development-yellow" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
</p>

[Live Demo](#live-demo) · [Features](#features) · [Architecture](#architecture--design-decisions) · [Tech Stack](#technology-stack) · [Installation](#installation) · [Project Structure](#project-structure)

---

## Live Demo

| Resource | Link |
|---|---|
| Live Application | [interviewx-two.vercel.app](https://interviewx-two.vercel.app) |
| Repository | [github.com/Tharunnxx/interviewx](https://github.com/Tharunnxx/interviewx) |

---

## Overview

InterviewX is a full-stack mock interview platform built to replicate the experience of a real technical interview rather than simulate one with static, pre-written questions.

Most interview-prep tools rely on fixed question banks and offer no interactive feedback loop — a user reads a question, writes an answer, and gets a generic explanation. InterviewX instead treats the interview as a live, voice-driven session: the system generates questions dynamically based on the candidate's target role, experience level, and tech stack, conducts the entire interview by voice, and evaluates the candidate's actual responses — not a multiple-choice approximation of them.

The interview lifecycle is:

1. A candidate specifies a job role, experience level, tech stack, and number of questions.
2. Google Gemini 2.5 Flash generates a tailored question set, with difficulty scaled to the selected experience level.
3. The AI interviewer asks each question aloud via Text-to-Speech.
4. The candidate answers verbally; Deepgram transcribes the response in real time.
5. After the session, Gemini evaluates the full transcript and produces a structured breakdown — overall score, category-level scoring, strengths, improvement areas, and a written summary.
6. Interview data and feedback are persisted to Firestore, scoped to the authenticated user, so candidates can track performance across sessions.

---

## Problem Statement

Effective interview preparation typically requires access to an experienced interviewer, individualized feedback, and repeated practice — none of which scale well. Existing tools largely substitute static question banks for that experience, which means a user can memorize answers without ever practicing the harder, less predictable parts of an interview: speaking under time pressure, articulating reasoning out loud, and receiving feedback on the actual answer given.

InterviewX is built around closing that gap — an AI interviewer that generates questions on the fly, runs the interview by voice, and evaluates the substance of what was actually said.

---

## Features

### Authentication & Session Management
- Firebase Authentication for registration and sign-in
- Firebase ID tokens are exchanged for HTTP-only session cookies via the Firebase Admin SDK (see [Authentication Flow](#authentication-flow))
- Server-side session validation gates access to protected routes
- All interview and feedback data is scoped to the authenticated user's UID

### AI-Generated Interviews
- Interview configuration (role, experience level, tech stack, question count) is collected through natural voice interaction rather than a form
- Google Gemini 2.5 Flash generates the question set dynamically per session — no static question bank
- Question difficulty adapts across Beginner, Intermediate, and Advanced tiers via prompt design

### Voice-Driven Interview Flow
- The AI interviewer asks each question using Text-to-Speech
- Candidates respond via microphone; Deepgram Speech-to-Text transcribes answers in real time
- A countdown timer is enforced per question
- Transcripts are persisted to Firestore as the interview progresses, with the next question triggered automatically on completion

### AI Evaluation
- Gemini evaluates the full set of responses post-interview and returns:
  - Overall interview score
  - Communication skills
  - Technical knowledge
  - Problem solving
  - Confidence & clarity
  - Cultural fit
  - Strengths and areas for improvement
  - A written summary
- The evaluation prompt is tuned to assess conceptual correctness and discount minor transcription artifacts from speech-to-text, rather than penalizing answers for STT noise

### Dashboard
- Displays a user's full interview history: role, difficulty, date, and linked feedback
- All queries filter on the authenticated UID, so dashboard data is never cross-visible between users

---

## Architecture & Design Decisions

This section documents the reasoning behind the system's structure, not just the stack used.

### Application Architecture

The app is built on **Next.js 15 (App Router)** using a hybrid rendering model — React Server Components where the data is static or server-fetched, and Client Components for stateful, interactive surfaces such as the voice interview interface itself. Rather than standing up a separate backend service, all server-side logic lives in **Next.js API Routes and Server Actions**, with business logic deliberately separated across:

- API routes (AI generation, transcription, TTS, feedback)
- Firebase utility modules (client and admin configuration)
- Reusable UI components
- Server actions (authentication, data mutations)

### Authentication Flow

```
Sign-in → Firebase ID Token → Firebase Admin SDK
        → HTTP-only Session Cookie → Server-side Session Validation
        → Access to Protected Routes
```

Firebase Authentication handles credential management, but the app does not rely on client-side tokens for authorization. After a successful login, the Firebase ID token is exchanged server-side for an **HTTP-only session cookie** via the Firebase Admin SDK. Every protected route validates this session on the server before returning data — the client never independently asserts who it is.

User isolation is enforced at the data layer, not just the route layer: the authenticated UID is written onto every interview document at creation time, and every Firestore read for interview or feedback data filters explicitly by that UID. There is no endpoint that returns interview data without a UID-scoped query.

### Database Design

Firestore is split into three collections, deliberately kept separate rather than nested:

| Collection | Stores | Notes |
|---|---|---|
| `users` | `uid`, `name`, `email` | Basic profile data |
| `interviews` | `userId`, role, experience level, tech stack, generated questions, answers, question count, timestamp | One document per interview session |
| `feedback` | `interviewId`, overall score, category scores, strengths, improvement areas, summary, timestamp | Linked to `interviews` via `interviewId`, not embedded |

Feedback is stored as its own collection rather than embedded inside the interview document. This keeps interview documents lightweight (no need to load evaluation data when just listing history) and makes feedback independently queryable — relevant since feedback is generated asynchronously, after the interview document already exists.

### AI Question Generation

Question generation is a prompt-engineering problem as much as an API integration. The generation prompt explicitly controls for job role, experience level, tech stack, and question count, and is written to push Gemini toward **JSON-only output** — no surrounding explanation text to strip out.

In practice, LLM output isn't always clean JSON: Gemini occasionally wraps responses in Markdown code fences or returns near-valid JSON with formatting quirks. The generation pipeline validates and sanitizes the response before parsing, so a malformed wrapper doesn't crash question creation.

### Voice Pipeline

```
Microphone → Deepgram (Speech-to-Text) → Transcript
           → Gemini AI → Text-to-Speech → Candidate
```

Both interview setup and the interview itself run through this pipeline. During the interview proper, the cycle is: TTS asks the question, the candidate answers verbally, Deepgram transcribes the answer, the transcript is displayed and persisted, and the next question is triggered — repeating until the question set is exhausted.

### AI Feedback Pipeline

Raw speech-to-text transcripts are noisy — filler words, false starts, and transcription artifacts are common even when the underlying answer is technically sound. Before evaluation, answers are cleaned to reduce that noise, and the evaluation prompt is explicitly written to score **conceptual correctness** over surface-level phrasing or grammar. This was a deliberate tuning decision: an evaluation pipeline that penalizes STT artifacts as if they were the candidate's own speaking errors produces feedback that's technically consistent but practically useless.

The feedback prompt was iterated on to avoid overly harsh scoring — the goal is feedback that reads like constructive coaching, not a pass/fail grade. Gemini's response is parsed and validated as structured JSON before being written to the `feedback` collection.

### Error Handling

AI calls and external APIs fail in ways normal CRUD operations don't — malformed responses, empty completions, transient API errors. The project handles this defensively rather than assuming happy-path responses:

- Gemini JSON responses are validated before parsing; malformed or empty responses don't propagate as silent failures
- Fallback feedback is returned if AI generation fails outright, rather than leaving a session in a broken state
- Unauthenticated interview creation attempts are rejected before any AI or database call is made
- Missing interview documents (e.g., a feedback request for a non-existent interview) are handled gracefully rather than throwing
- AI API calls and Firestore operations are wrapped in try/catch at each integration point, not just at a top-level handler

### Prompt Engineering

Prompt design is treated as a first-class part of the system rather than an implementation detail. Separate prompts exist for question generation, difficulty control, and feedback generation, each instructing Gemini to:

- Return valid JSON only, with no surrounding explanation
- Generate industry-realistic questions rather than generic trivia
- Scale question complexity to the candidate's stated experience level
- Produce coaching-oriented, constructive feedback rather than terse scoring

### Security

- Firebase Authentication governs account access
- Session cookies are HTTP-only, reducing exposure to client-side token theft
- Every Firestore query for interview or feedback data is scoped to the authenticated user's UID
- Protected routes require a valid server-validated session before executing
- There is no code path through which a user can read another user's interview or feedback data

---

## System Workflow

```
Authentication
      │
      ▼
  Dashboard
      │
      ▼
Create Interview
      │
      ▼
Voice-based Interview Setup
      │
      ▼
Deepgram Speech-to-Text
      │
      ▼
Gemini AI — Question Generation
      │
      ▼
Questions Persisted to Firestore
      │
      ▼
AI Conducts Interview (TTS)
      │
      ▼
Candidate Answers via Voice
      │
      ▼
Deepgram Transcribes Answers
      │
      ▼
Answers Persisted to Firestore
      │
      ▼
Gemini Evaluates Full Transcript
      │
      ▼
Structured Feedback Generated
      │
      ▼
Feedback Persisted (linked via interviewId)
      │
      ▼
Dashboard Updated
```

---

## Technology Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | Next.js 15 (App Router), React, TypeScript | UI, routing, hybrid server/client rendering |
| Styling | Tailwind CSS, ShadCN UI | Component styling and design system |
| Backend | Next.js API Routes, Server Actions | Business logic, no separate backend service |
| Database | Firebase Cloud Firestore | Interview, feedback, and user data persistence |
| Authentication | Firebase Authentication, Firebase Admin SDK | Identity, session cookie issuance and validation |
| AI | Google Gemini 2.5 Flash | Question generation, response evaluation, feedback generation |
| Speech-to-Text | Deepgram API | Real-time transcription of candidate answers |
| Text-to-Speech | TTS API | AI interviewer voice output |
| Deployment | Vercel | — |

---

## APIs

| Service | Used For |
|---|---|
| **Google Gemini** | Dynamic interview question generation; post-interview response evaluation and feedback generation |
| **Deepgram** | Real-time speech-to-text transcription of candidate voice answers |
| **Firebase** | User authentication (session cookie issuance/validation) and Firestore-based data persistence |

Internal API routes:

| Route | Responsibility |
|---|---|
| `app/api/generate-questions` | Sends role/level/stack/count to Gemini, validates and returns the generated question set |
| `app/api/feedback` | Sends the full interview transcript to Gemini for evaluation, validates and persists structured feedback |
| `app/api/transcribe` | Forwards audio to Deepgram and returns the transcript |
| `app/api/tts` | Converts interview questions to speech for the AI interviewer |

---

## Project Structure

```
interviewx/
├── app/
│   ├── api/
│   │   ├── generate-questions/   # Gemini question generation
│   │   ├── feedback/             # AI evaluation logic
│   │   ├── transcribe/           # Deepgram speech-to-text
│   │   └── tts/                  # Text-to-speech endpoint
│   ├── (auth)/                   # Authentication pages
│   ├── dashboard/                # User dashboard
│   └── interview/                # Interview pages
├── components/
│   ├── agent/                    # AI interviewer / voice interaction components
│   ├── interview-cards/          # Interview history UI
│   └── ui/                       # ShadCN-based UI primitives
├── firebase/
│   ├── client.ts                 # Firebase client configuration
│   └── admin.ts                  # Firebase Admin SDK configuration
├── lib/
│   ├── actions/                  # Server actions (auth, data mutations)
│   └── utils/                    # Shared utilities
├── public/
├── .env.example
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- A Firebase project with Authentication and Firestore enabled
- A Google Gemini API key
- A Deepgram API key

### Setup

```bash
git clone https://github.com/<your-username>/interviewx.git
cd interviewx
npm install
cp .env.example .env.local
```

### Environment Variables

```env
# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Google Gemini
GEMINI_API_KEY=

# Deepgram
DEEPGRAM_API_KEY=
```

### Run

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Usage

1. **Sign up / sign in** — create an account or log in via Firebase Authentication.
2. **View dashboard** — see prior interviews, if any.
3. **Create an interview** — specify job role, experience level, tech stack, and question count by voice.
4. **Take the interview** — the AI interviewer asks each question aloud; answer via microphone.
5. **Review feedback** — after the final question, Gemini evaluates the full transcript and the dashboard updates with the score breakdown, strengths, improvement areas, and summary.

---

## Screenshots

_Screenshots will be added once available. Place images in a `/screenshots` directory and reference them as below._

| Page | Reference |
|---|---|
| Landing Page | `![Landing Page](./screenshots/landing.png)` |
| Dashboard | `![Dashboard](./screenshots/dashboard.png)` |
| Interview Setup | `![Interview Setup](./screenshots/setup.png)` |
| Live Voice Interview | `![Voice Interview](./screenshots/interview.png)` |
| Feedback / Results | `![Feedback](./screenshots/feedback.png)` |

---

## Challenges Solved

- Dynamic, on-demand AI question generation in place of a static question bank
- A fully voice-driven interview workflow, end to end
- Real-time speech-to-text integration with downstream transcript handling
- Difficulty-aware question generation through prompt engineering, not separate question sets per level
- Evaluation tuning to score conceptual correctness while discounting transcription noise
- Clean separation of interview and feedback data in Firestore, linked by `interviewId`
- Server-validated session authentication with per-user data isolation enforced at the query level

---

## Future Enhancements

- Resume-based interview generation
- Coding interview mode
- AI-generated follow-up questions based on prior answers
- Performance trend analytics across sessions
- Interview recording and playback
- Leaderboard and achievements
- Multi-language interview support
- AI-generated personalized interview-prep roadmap
- Recruiter-facing dashboard
- Company-specific interview templates

---

## Contributing

Contributions are welcome. To propose a change:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes with clear messages
4. Open a pull request describing the change and motivation

For larger changes, please open an issue first to discuss scope and approach.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

Built as a full-stack exploration of AI-driven interview simulation — combining LLM-based generation and evaluation, real-time speech pipelines, and a security-conscious authentication model.
