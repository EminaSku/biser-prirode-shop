## Setup

### Backend
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev

### Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev
