# 🧭 PathFinder — AI Career Counsellor

> AI-powered career guidance for Tier-2/3 Indian students. In your language. Matching your budget.

---

## 🚀 Quick Start (10 minutes)

### 1. Clone & Setup

```bash
git clone https://github.com/YOUR_USERNAME/pathfinder.git
cd pathfinder
```

### 2. Setup Backend

```bash
cd server
npm install
cp .env.example .env
# Fill in your keys in .env (see below)
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

Open http://localhost:3000 🎉

---

## 🔑 Environment Variables

### server/.env

```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/pathfinder
JWT_SECRET=pathfinder_secret_2026
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxx
CLIENT_URL=http://localhost:3000
```

### client/.env

```env
VITE_API_URL=http://localhost:5000
```

---

## 🔑 Getting API Keys

| Key | Where to get | Free? |
|---|---|---|
| GROQ_API_KEY | console.groq.com → API Keys | ✅ Free |
| MONGODB_URI | mongodb.com/atlas → Free cluster | ✅ Free |
| ELEVENLABS_API_KEY | elevenlabs.io → Profile | ✅ Free tier |

---

## 📁 Project Structure

```
pathfinder/
├── client/               ← React + Vite frontend
│   ├── src/
│   │   ├── pages/        ← All page components
│   │   ├── components/   ← Reusable components
│   │   ├── context/      ← Global state (UserContext)
│   │   ├── data/         ← Hardcoded quiz/schemes/colleges
│   │   ├── hooks/        ← useGroq hook
│   │   └── App.jsx       ← Router
│   └── index.html
│
└── server/               ← Node.js + Express backend
    ├── routes/
    │   ├── auth.js       ← Register/Login/Profile
    │   ├── career.js     ← Suggest/Roadmap/SkillGap/Budget
    │   ├── interview.js  ← Questions/Evaluate/Report
    │   ├── schemes.js    ← Govt scheme matching
    │   └── colleges.js   ← College finder
    ├── models/User.js
    ├── middleware/auth.js
    ├── prompts/index.js  ← All Groq prompts
    ├── utils/groq.js     ← Groq API helper
    └── index.js          ← Server entry point
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/career/suggest | AI career suggestions |
| POST | /api/career/roadmap | 3/6/12 month roadmap |
| POST | /api/career/skillgap | Skill gap analysis |
| POST | /api/career/budget | Budget-aware advice |
| POST | /api/interview/questions | Get interview questions |
| POST | /api/interview/evaluate | Evaluate answer |
| POST | /api/interview/final-report | Final score report |
| GET  | /api/schemes | Get all schemes |
| POST | /api/schemes/match | Match schemes to profile |
| GET  | /api/colleges | Filter colleges |
| POST | /api/colleges/recommend | Recommend colleges |
| GET  | /health | Server health check |

---

## 🚢 Deployment

**Frontend → Vercel**
```bash
cd client && npm run build
# Connect GitHub repo to Vercel, set root to /client
# Add env variable: VITE_API_URL=https://your-server.onrender.com
```

**Backend → Render**
```
Connect GitHub repo to Render
Root: /server
Build: npm install
Start: npm start
Add all env variables in Render dashboard
```

---

## 🎨 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router |
| Styling | CSS Variables, Custom CSS |
| Animations | CSS Keyframes, SVG animations |
| AI | Groq API (llama-3.3-70b-versatile) |
| Voice | Web Speech API (STT + TTS) |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Auth | JWT |

---

Built with ❤️ for Bharat · PathFinder 2026
