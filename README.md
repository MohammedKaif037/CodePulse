# CodePulse - AI-Powered Dev Coding Habit Tracker

![CodePulse Logo](https://placeholder.svg?height=200&width=200)

CodePulse is an AI-powered coding habit tracker designed to help developers build consistent coding habits, track their progress, and receive personalized guidance to improve their skills.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [AI Integration](#ai-integration)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Authentication & Onboarding
- **User Registration & Login**: Secure authentication using Supabase Auth
- **Personalized Onboarding**: Multi-step questionnaire to understand user goals, preferences, and skill level
- **Profile Management**: Update personal information, preferences, and settings

### Dashboard & Analytics
- **Coding Activity Tracking**: Monitor daily coding time, languages used, and topics covered
- **Streak Calendar**: Visualize coding consistency with a heatmap calendar
- **Progress Charts**: Track coding habits across different languages and topics
- **XP & Level System**: Gamified progression system to encourage consistent practice

### Task & Project Management
- **Task Manager**: Create, prioritize, and track coding-related tasks
- **Project Tracker**: Manage coding projects with progress tracking and task lists
- **Daily Challenges**: Receive personalized coding challenges based on skill level and interests

### AI-Powered Features
- **AI Chat Assistant**: Get coding advice, habit tips, and learning resources
- **Personalized Insights**: Receive AI-generated insights based on your coding patterns
- **Learning Recommendations**: Get customized learning resource recommendations
- **Daily Challenge Generation**: AI-generated coding challenges tailored to your skill level

### Learning Resources
- **Curated Learning Feed**: Personalized articles, videos, tutorials, and courses
- **Resource Bookmarking**: Save resources for later reference
- **Learning Path Tracking**: Follow structured learning paths for skill development

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, Supabase Functions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: ChatAnywhere API (GPT-3.5 Turbo)
- **State Management**: React Hooks
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account
- ChatAnywhere API key

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/codepulse.git
   cd codepulse
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   pnpm install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables)).

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   pnpm dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ChatAnywhere API
CHAT_ANYWHERE_API_KEY=your_chat_anywhere_api_key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## 📁 Project Structure

\`\`\`
codepulse/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── auth/               # Auth-related pages
│   ├── dashboard/          # Dashboard pages
│   ├── login/              # Login page
│   ├── onboarding/         # Onboarding flow
│   ├── register/           # Registration page
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── ui/                 # UI components (shadcn/ui)
│   └── ...                 # Feature-specific components
├── lib/                    # Utility functions and services
│   ├── ai-service.ts       # AI integration services
│   └── supabase.ts         # Supabase client and types
├── public/                 # Static assets
├── middleware.ts           # Next.js middleware for auth protection
├── .env.local              # Environment variables (not in repo)
└── ...                     # Config files
\`\`\`

## 🔐 Authentication Flow

1. **Registration**:
   - User signs up with email and password
   - Supabase creates a new user account
   - User is redirected to the onboarding flow

2. **Login**:
   - User logs in with email and password
   - If user has completed onboarding, redirect to dashboard
   - If not, redirect to onboarding flow

3. **Onboarding**:
   - Multi-step questionnaire to collect user preferences
   - Data is stored in the user's profile
   - After completion, user is redirected to dashboard

4. **Route Protection**:
   - Middleware checks authentication status for protected routes
   - Unauthenticated users are redirected to login
   - Authenticated users without completed profiles are directed to onboarding

## 🤖 AI Integration

CodePulse uses the ChatAnywhere API to provide AI-powered features:

1. **AI Chat Assistant**:
   - Real-time chat interface for coding advice and guidance
   - System prompt tailored for coding habit development

2. **Daily Challenge Generation**:
   - AI generates personalized coding challenges based on user's skill level and interests

3. **Personalized Insights**:
   - AI analyzes user activity to provide tailored recommendations
   - Identifies skill gaps and suggests improvement areas

4. **Learning Resource Recommendations**:
   - AI curates learning resources based on user's goals and technologies

## 📊 Database Schema

The Supabase database includes the following tables:

1. **profiles**:
   - User profile information
   - Preferences, goals, and settings

2. **tasks**:
   - Coding tasks and goals
   - Priority, due dates, and completion status

3. **projects**:
   - Coding projects
   - Progress tracking and status

4. **project_tasks**:
   - Tasks associated with specific projects

5. **coding_activity**:
   - Daily coding activity records
   - Time spent, languages used, topics covered

6. **challenges**:
   - Daily coding challenges
   - Difficulty, type, and completion status

7. **learning_resources**:
   - Curated learning materials
   - Articles, videos, tutorials, courses

8. **saved_resources**:
   - User-saved learning resources

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using Next.js, Supabase, and AI
