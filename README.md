# 🎓 LearnHub — Full Stack Learning Management System

An AI-powered Learning Management System (LMS) built with the MERN stack. LearnHub allows educators to create and publish courses, and students to discover, enroll, and learn through an AI-powered experience.

---


## ✨ Features

### 👨‍🎓 For Students
- Browse and search all published courses
- **AI-powered course search** (natural language query support)
- View detailed course pages with curriculum, ratings, and instructor info
- Enroll in courses via **Razorpay payment gateway**
- Watch course lectures video by video
- Take AI-generated **course quizzes** based on course content
- View enrolled courses dashboard
- Write and view **course reviews & ratings**
- Edit profile with photo upload

### 👩‍🏫 For Educators
- Full **Educator Dashboard** with revenue charts (Recharts)
- Create, edit, and delete courses (with thumbnail upload)
- Add, edit, and remove individual video lectures
- Upload lecture transcripts for AI quiz generation
- Mark lectures as free preview
- View student enrollment stats
- Educators can also enroll in other educators' courses as students
- Cannot enroll in their own courses (prevented on frontend)

### 🔐 Authentication
- Email/password signup & login
- **Google Sign-In** via Firebase
- OTP-based **password reset** via email (Nodemailer)
- JWT tokens stored in HTTP-only cookies

### 🤖 AI Features
- **AI Course Search**: Find courses using natural language (e.g. *"beginner Python for data science"*)
- **AI Quiz Generation**: Automatically generates MCQ quizzes using Google Gemini AI from lecture transcripts

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| Vite 7 | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| Redux Toolkit | Global state management |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Recharts | Analytics charts |
| Firebase | Google OAuth |
| Razorpay JS SDK | Payments (client-side) |
| React Toastify | Notifications |
| React Icons / Lucide | Icon sets |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| Bcryptjs | Password hashing |
| Cloudinary | Image & video storage |
| Multer | File upload handling |
| Razorpay SDK | Payment order creation & verification |
| Google Gemini AI (`@google/genai`) | AI quiz & search generation |
| Nodemailer | OTP email delivery |
| Firebase Admin | Google auth verification |
| Nodemon | Dev auto-reload |

---

## 📁 Project Structure

```
LearnHub/
├── Backend/
│   ├── config/           # Cloudinary, DB, JWT, email config
│   ├── controllers/      # Route handler logic
│   ├── middleware/        # Auth middleware (JWT verify)
│   ├── models/           # Mongoose schemas (User, Course, Lecture, Review, Order)
│   ├── route/            # Express routes
│   ├── public/           # Static file serving
│   └── index.js          # Entry point
│
└── Frontend/
    └── src/
        ├── assets/        # Static images & logo
        ├── component/     # Reusable UI components (Nav, Footer, Card, etc.)
        ├── pages/         # Page-level components
        │   ├── Educator/  # Dashboard, AddCourse, CreateLecture, EditLecture
        │   ├── Home.jsx
        │   ├── AllCourses.jsx
        │   ├── ViewCourse.jsx
        │   ├── ViewLecture.jsx
        │   ├── CourseQuiz.jsx
        │   ├── EnrolledCourse.jsx
        │   ├── StudentDashboard.jsx
        │   ├── SearchWithAi.jsx
        │   └── ...auth pages
        └── redux/         # courseSlice, userSlice, lectureSlice, reviewSlice
```

---

## ⚙️ Environment Setup

### Backend — `/Backend/.env`

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

GEMINI_API_KEY=your_google_gemini_api_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Frontend — `/Frontend/.env`

```env
VITE_SERVER_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- Razorpay account (test mode works)
- Google Gemini API key
- Firebase project with Google Auth enabled

### 1. Clone the repository

```bash
git clone https://github.com/your-username/LearnHub.git
cd LearnHub
```

### 2. Install Backend dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend dependencies

```bash
cd ../Frontend
npm install
```

### 4. Configure environment variables

Create `.env` files in both `Backend/` and `Frontend/` directories using the templates above.

### 5. Start the development servers

**Backend** (from `/Backend`):
```bash
npm run dev
# Starts on http://localhost:8000
```

**Frontend** (from `/Frontend`):
```bash
npm run dev
# Starts on http://localhost:5173
```

---

## 🔑 Key Pages & Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/allcourses` | Browse all courses |
| `/searchwithai` | AI-powered search |
| `/viewcourse/:courseId` | Course detail page |
| `/viewlecture/:courseId` | Watch enrolled course |
| `/quiz/:courseId` | Take AI-generated quiz |
| `/enrolledcourses` | My enrolled courses |
| `/student-dashboard` | Student analytics |
| `/dashboard` | Educator dashboard |
| `/addcourse` | Create new course |
| `/addcourses/:courseId` | Manage course & lectures |
| `/createlecture/:courseId` | Add lectures |
| `/editlecture/:courseId/:lectureId` | Edit lecture |
| `/login` | Login |
| `/signup` | Sign up |
| `/profile` | View profile |
| `/editprofile` | Edit profile |
| `/forgetpassword` | OTP password reset |

---

## 💳 Payment Flow (Razorpay)

1. User clicks **Enroll Now** on a course page
2. Frontend calls `POST /api/payment/create-order` → Razorpay order is created
3. Razorpay popup opens in the browser
4. On payment success, frontend calls `POST /api/payment/verify-payment`
5. Backend verifies the signature and enrolls the user into the course

---

## 🤖 AI Quiz Flow

1. Educator uploads lecture video + transcript when creating/editing a lecture
2. Student completes watching the course and clicks **Take Quiz**
3. Frontend calls `GET /api/ai/generate-quiz/:courseId`
4. Backend feeds all lecture transcripts into **Google Gemini AI**
5. Gemini returns structured MCQ questions with correct answers
6. Student answers questions and receives an instant AI-graded score

---

## 📸 Screenshots

<img width="1908" height="909" alt="Screenshot 2026-04-10 230023" src="https://github.com/user-attachments/assets/4788bd79-dbca-4bc2-9471-44855a82020f" />


---

## 📄 License

This project is licensed under the **MIT License**.

---

