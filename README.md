# 🎯 InterviewX

### AI-Powered Voice-Based Mock Interview Platform

InterviewX is a full-stack, production-ready platform that simulates real technical interviews using **Generative AI** and **voice interaction**. It generates personalized interview questions, conducts a fully voice-driven interview, and delivers detailed AI-powered feedback — helping students and job seekers prepare for real interviews affordably and effectively.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Deepgram-STT-13EF93?logo=data:image/png;base64,&logoColor=black" alt="Deepgram" />
  <img src="https://img.shields.io/badge/status-in%20development-yellow" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
</p>

<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-future-enhancements">Roadmap</a>
</p>

---

## 🌐 Live Demo

> 🚧 **Not deployed yet.** Deployment to **Vercel** is planned — this section will be updated with a live link once the app is live.

| Resource | Link |
|---|---|
| 🔗 Live App | _Coming soon_ |
| 📦 Repository | _Add your GitHub repo URL here_ |

---

## 📖 Project Overview

**InterviewX** is a full-stack AI-powered mock interview platform that simulates real technical interviews using Generative AI and voice interaction.

Users create personalized mock interviews by specifying:
- 🎯 Target **job role**
- 📊 **Experience level** (Beginner / Intermediate / Advanced)
- 🛠️ Preferred **tech stack**
- 🔢 **Number of questions**

Instead of relying on static, predefined question banks, InterviewX uses **Google Gemini AI** to dynamically generate realistic interview questions every time. The entire interview is **voice-based** — the AI asks questions via **Text-to-Speech (TTS)**, the user responds via microphone, and **Deepgram Speech-to-Text (STT)** transcribes the spoken answer for evaluation.

Once the interview ends, **Gemini AI** analyzes every response and generates detailed feedback — an overall score, category-wise evaluation, strengths, improvement areas, and a summary. All interview history and feedback are stored securely in **Firebase Cloud Firestore**, so users can revisit past interviews and track their progress over time.

> 💡 **Goal:** Provide an affordable, realistic interview-prep experience that helps students and job seekers sharpen their technical interview skills through personalized AI feedback.

---

## ✨ Features

### 🔐 Authentication
| Feature | Description |
|---|---|
| Firebase Authentication | Secure user identity management |
| Secure Sign Up / Sign In | Email-based authentication flow |
| Session Management | Persistent, secure sessions |
| Multi-user Support | Each user has isolated interview data |

### 🤖 AI Interview Generation
| Feature | Description |
|---|---|
| Dynamic Question Generation | Powered by **Google Gemini 2.5 Flash** |
| Customizable Parameters | Job Role, Experience Level, Tech Stack, Question Count |
| Difficulty Scaling | Beginner / Intermediate / Advanced support |

### 🎙️ Voice-Based Interview
| Feature | Description |
|---|---|
| Text-to-Speech (TTS) | AI reads out interview questions aloud |
| Microphone Input | Users respond naturally via voice |
| Deepgram STT | Converts spoken answers into text in real time |
| Countdown Timer | Time-boxed responses for realism |

### 📊 AI Evaluation
The AI evaluates every answer and generates a multi-dimensional performance report:

- ✅ Overall Interview Score
- 🗣️ Communication Skills
- 🧠 Technical Knowledge
- 🧩 Problem Solving
- 💪 Confidence & Clarity
- 🤝 Cultural Fit
- 🌟 Strengths
- 📈 Areas of Improvement
- 📝 Overall Summary

### 📋 Dashboard
- Displays user-specific interview history
- Stores all previous interviews
- View detailed breakdowns of past sessions
- Revisit and review any completed interview

### 🗄️ Database (Firebase Firestore)
Stores:
- User Information
- Interview Metadata
- Generated Questions
- User Answers
- AI Feedback & Category Scores
- Overall Score
- Full Interview History

---

## 🏗️ Architecture

```
                         ┌─────────────┐
                         │     User     │
                         └──────┬──────┘
                                │
                                ▼
                  ┌─────────────────────────┐
                  │  Firebase Authentication │
                  └──────────────┬──────────┘
                                  │
                                  ▼
                          ┌──────────────┐
                          │   Dashboard   │
                          └──────┬───────┘
                                  │
                                  ▼
                   ┌───────────────────────────┐
                   │   Voice Interview Setup    │
                   └──────────────┬─────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  Deepgram (STT)  │
                          └────────┬────────┘
                                    │
                                    ▼
                  ┌──────────────────────────────┐
                  │ Gemini AI – Question Generation │
                  └──────────────┬───────────────┘
                                  │
                                  ▼
                          ┌─────────────────┐
                          │ Firebase Firestore│
                          └────────┬────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │  Voice Interview │
                          └────────┬────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │  Deepgram (STT)  │
                          └────────┬────────┘
                                    │
                                    ▼
                  ┌──────────────────────────────┐
                  │  Gemini AI – Feedback Generation │
                  └──────────────┬───────────────┘
                                  │
                                  ▼
                  ┌──────────────────────────────┐
                  │  Firebase – Feedback Storage   │
                  └──────────────┬───────────────┘
                                  │
                                  ▼
                  ┌──────────────────────────────┐
                  │     Dashboard & Results        │
                  └────────────────────────────────┘
```

---

## 🔄 Complete Workflow

```
1.  User creates an account or signs in
2.  Dashboard displays previous interviews
3.  User clicks "Create Interview"
4.  AI asks setup questions via voice:
       → Job Role
       → Experience Level
       → Tech Stack
       → Number of Questions
5.  Deepgram converts spoken responses → text
6.  Gemini AI generates personalized interview questions
7.  Questions are stored in Firebase
8.  User starts the interview
9.  AI reads each question via TTS
10. User answers via voice
11. Deepgram converts answers → text
12. Answers are stored in Firebase
13. Gemini AI evaluates all responses
14. AI generates:
       → Overall Score
       → Category-wise Scores
       → Strengths
       → Improvements
       → Summary
15. Feedback is stored in a separate Firestore collection (linked via interviewId)
16. Dashboard displays full interview history for the logged-in user
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React, TypeScript, Tailwind CSS, ShadCN UI |
| **Backend** | Next.js API Routes |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Authentication |
| **AI Engine** | Google Gemini 2.5 Flash |
| **Speech-to-Text** | Deepgram STT API |
| **Text-to-Speech** | TTS API |
| **Deployment** | Vercel *(planned)* |

---

## 📦 Installation

### Prerequisites
- Node.js `v18+`
- npm / yarn / pnpm
- A Firebase project (Firestore + Authentication enabled)
- A Google Gemini API key
- A Deepgram API key

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/interviewx.git
cd interviewx

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

Add the following to your `.env.local`:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Gemini
GEMINI_API_KEY=

# Deepgram
DEEPGRAM_API_KEY=
```

```bash
# 4. Run the development server
npm run dev
```

The app will be available at **`http://localhost:3000`**.

---

## 📂 Project Structure

```
interviewx/
├── app/                        # Routing and pages (Next.js App Router)
│   ├── api/
│   │   ├── generate-questions/ # Gemini question generation
│   │   ├── feedback/           # AI evaluation logic
│   │   ├── transcribe/         # Deepgram speech-to-text
│   │   └── tts/                # Text-to-speech endpoint
│   └── ...                     # Pages (dashboard, interview, auth, etc.)
├── components/                  # Reusable UI components
├── firebase/                    # Firebase configuration & client setup
├── lib/                         # Server actions and utility functions
├── public/                      # Static assets
├── .env.example                 # Sample environment variables
└── README.md
```

| Folder | Responsibility |
|---|---|
| `app/` | Routing and Pages |
| `components/` | Reusable UI Components |
| `firebase/` | Firebase Configuration |
| `lib/` | Server Actions and Utilities |
| `app/api/generate-questions` | Gemini Question Generation |
| `app/api/feedback` | AI Evaluation |
| `app/api/transcribe` | Deepgram Speech-to-Text |
| `app/api/tts` | Text-to-Speech |

---

## 📸 Screenshots

> 🖼️ Screenshots will be added here once available. Drop images into a `/screenshots` folder and reference them as shown below.

| Page | Preview |
|---|---|
| Landing Page | `![Landing Page](./screenshots/landing.png)` |
| Dashboard | `![Dashboard](./screenshots/dashboard.png)` |
| Interview Setup | `![Interview Setup](./screenshots/setup.png)` |
| Live Voice Interview | `![Voice Interview](./screenshots/interview.png)` |
| Feedback / Results | `![Feedback](./screenshots/feedback.png)` |

---

## 🌟 Key Highlights

- ⚡ Dynamic AI-generated interview questions (no static question banks)
- 🎙️ Fully voice-based interview simulation
- 📝 Real-time Speech-to-Text transcription
- 📊 AI-generated, multi-category performance feedback
- 🎯 Personalized interview experience based on role, level & stack
- 📁 User-specific interview history
- ☁️ Firebase cloud database integration
- 🎨 Clean, modern UI with ShadCN
- 🧱 Scalable, full-stack AI architecture

---

## 🚀 Future Enhancements

- [ ] 🌍 Deploy to Vercel for public access
- [ ] 🎥 Add video-based mock interviews with facial expression analysis
- [ ] 🧑‍🤝‍🧑 Peer-to-peer mock interview mode
- [ ] 📱 Mobile-responsive PWA support
- [ ] 🌐 Multi-language interview support
- [ ] 📈 Progress analytics & performance trends over time
- [ ] 🏢 Company-specific interview question sets
- [ ] 🔄 Resume-based question personalization
- [ ] 🗂️ Export interview reports as PDF
- [ ] 🔔 Email/notification summary after each interview

---

## 🙏 Acknowledgements

- [Google Gemini](https://ai.google.dev/) — AI question generation and evaluation engine
- [Deepgram](https://deepgram.com/) — Real-time Speech-to-Text API
- [Firebase](https://firebase.google.com/) — Authentication and Firestore database
- [Next.js](https://nextjs.org/) — Full-stack React framework
- [ShadCN UI](https://ui.shadcn.com/) — UI component library
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework

---

## 📄 License

This project is licensed under the **MIT License** — feel free to update this section based on your preference.

---

<p align="center">Built to help job seekers ace their interviews</p>
