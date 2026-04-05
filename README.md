# QuizArena

A fully-featured real-time multiplayer trivia game.

## Features
- Dynamic real-time gameplay with synchronized 20-second timers
- Live updating Leaderboard with rank progression animations
- Speed bonus scoring logic
- Modern, dark-themed responsive UI powered by TailwindCSS and Framer Motion glass-pane effects
- Final winner confetti and gameplay stats

## Tech Stack
- Frontend: React (Vite, Framer Motion, Tailwind CSS)
- Backend: Node.js, Express, Socket.io
- Database: JSON questions database

## How to run locally

### 1. Start the Backend Server
```bash
cd quizarena/server
npm install
node index.js
```

### 2. Start the Frontend Client
```bash
cd quizarena/client
npm install
npm run dev
```

Enjoy playing against your friends locally on `localhost:5173` or deploy to the web!
