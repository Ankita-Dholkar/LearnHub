# 🎓 LearnHub — Full Stack Learning Management System

An AI-powered Learning Management System (LMS) built with the MERN stack. LearnHub allows educators to create and publish courses, and students to discover, enroll, and learn through an AI-powered experience.

---

🚀 Key Features

👨‍🎓 Students
- Browse & search courses
- 🤖 AI-powered search (natural language queries)
- Enroll using Razorpay payments
- Watch lectures & track progress
- Take AI-generated quizzes
- Add reviews & ratings

---

 👩‍🏫 Educators
- Create, edit & manage courses
- Upload video lectures + transcripts
- 📊 Dashboard with analytics (Recharts)
- Track student enrollments & revenue

---
🔐 Authentication
- Email/password login
- Google Sign-In (Firebase)
- OTP-based password reset (Nodemailer)

  ---
🤖 AI Features
- AI Course Search (Gemini AI)
- AI Quiz Generation

  ---
🛠 Tech Stack
- Frontend: React 19, Vite, Tailwind CSS, Redux Toolkit, Recharts
- Backend: Node.js, Express, MongoDB, JWT
- Integrations: Razorpay, Firebase Auth, Cloudinary, Gemini AI

---
📸 Screenshots
<img width="1908" height="909" alt="Screenshot 2026-04-10 230023" src="https://github.com/user-attachments/assets/88494ca5-1487-4d66-9f10-69f1216853d9" />

---
⚡ Live Highlights
- Full MERN stack implementation
- Real-world payment integration
- AI-powered search + quiz system
- Role-based dashboards (Student & Educator)

  ---
📚 Detailed Documentation

✨ Features 

👨‍🎓 For Students
- Browse and search all published courses
- AI-powered course search
- View course details (curriculum, ratings, instructor info)
- Enroll via Razorpay
- Watch lectures video by video
- Take AI-generated quizzes
- View enrolled courses dashboard
- Add reviews & ratings
- Edit profile with photo upload

  ---
👩‍🏫 For Educators
- Full dashboard with analytics
- Create, edit, delete courses
- Manage lectures (add/edit/remove)
- Upload transcripts for AI quiz
- Track enrollments
- Can enroll in other courses

---
📁 Project Structure
```bash
LearnHub/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── route/
│   └── index.js
│
└── Frontend/
    └── src/
        ├── component/
        ├── pages/
        ├── redux/
        └── assets/
```

        
⚙️ Environment Setup
-Backend (.env)
```bash
-PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

GEMINI_API_KEY=your_gemini_api_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Frontend (.env)
```bash
VITE_SERVER_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

🏃 Getting Started
```bash
# Clone repo
git clone https://github.com/your-username/LearnHub.git
cd LearnHub

# Backend
cd Backend
npm install
npm run dev

# Frontend
cd ../Frontend
npm install
npm run dev
```
💳 Payment Flow
1. User clicks Enroll Now
2. Backend creates Razorpay order
3. Razorpay popup opens
4. Payment verification
5. User enrolled

---
🤖 AI Quiz Flow
1. Educator uploads transcript
2. Backend sends data to Gemini AI
3. AI generates MCQs
4. Student takes quiz
5. Instant scoring

---
📄 License

 MIT License
