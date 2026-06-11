# 🎓 Axiora – School Management System

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-blue.svg?style=for-the-badge" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/WebRTC-Conferencing-orange.svg?style=for-the-badge" alt="WebRTC" />
  <img src="https://img.shields.io/badge/Socket.io-Real--time-black.svg?style=for-the-badge" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Groq%20AI-Doubt--Solver-purple.svg?style=for-the-badge" alt="Groq AI" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-blue.svg?style=for-the-badge" alt="Razorpay" />
</p>

<p align="center">
  <h1 align="center">Axiora</h1>
  <h3 align="center">
    A Modern, Feature-Rich Educational Management & Virtual Classroom Platform
  </h3>
</p>

<p align="center">
Manage students, teachers, classes, attendance, examinations, notice boards, secure fee payments, real-time WebRTC live classes, and AI-powered academic support from a single unified portal.
</p>

---

## 🚀 Live Demo

* **Frontend Client (Vercel):** [https://axiora-psi.vercel.app](https://axiora-psi.vercel.app)
* **Backend API (Render):** [https://axiora-wf0q.onrender.com](https://axiora-wf0q.onrender.com)

---

## 📖 About

**Axiora** is a comprehensive, production-grade School Management System designed to bridge the gap between educational administration, teachers, and students. Initially built on the classic MERN stack (MongoDB, Express, React, Node), Axiora has evolved into a real-time collaborative workspace featuring high-performance peer-to-peer virtual classrooms, smart moderation controls, automated attendance/performance email warnings, secure payment processing, and interactive AI-driven doubt solving.

Dedicated, responsive dashboards ensure that Admins, Teachers, and Students have tailored tools and interfaces to manage academic operations efficiently.

---

## ✨ Features & Capabilities

### 🎥 Real-Time Virtual Classrooms (WebRTC & Socket.io)
* **Full-Mesh Video & Audio Conferencing:** High-quality, low-latency communication directly in the browser via `RTCPeerConnection` with STUN server configuration.
* **Smart Screen Sharing:** Presenters can share their screens with the room dynamically.
* **Visual Presenter Layouts:** 
  * A dedicated **Big Screen** view for active presenters.
  * **Split-Screen Layout** when multiple participants are granted presenter privileges.
  * Sidebar panel for non-presenting participants to maximize workspace.
* **Persistent Meeting Lifecycles:** Meetings can be closed permanently by hosts (Teacher/Admin). When a meeting is terminated, all participants are immediately disconnected, and any future attempts to join that room ID are redirected to a **"Class Has Ended"** screen.
* **Real-time Live Chat:** Embedded chat within the meeting room containing sender names, avatars, timestamps, and role-based badges (e.g., Teacher, Admin, Student) with distinctive styling for teachers.
* **Instant Class Invites:** Real-time modal notifications pop up for students when their teacher launches a class, enabling instant entry.

### 🎙 Advanced Classroom Moderation & Settings
* **Host Pre-Sets:** Launch meetings with custom lock presets (e.g., disable students' mics or cameras by default upon joining).
* **Class-Wide Locks:** Teachers/Admins can toggle class-wide audio or video locks in real-time.
* **Granular Peer Controls:** Toggle mic/camera access, force-mute specific peers, or grant/revoke presenter privileges on an individual student basis.

### 🤖 AI-Powered Doubt Solver
* **Groq SDK Integration:** Connects students with a smart educational tutor powered by `llama-3.3-70b-versatile`.
* **Guided Pedagogy:** Instead of simply spitting out homework answers, the tutor uses step-by-step explanations, helpful metaphors, and structured examples to explain complex academic concepts.

### 💳 Digital Fee Management & Billing
* **Razorpay Payment Gateway:** Integrated secure checkouts allowing students and parents to pay tuition fees online.
* **Verify Signatures:** High-security payment signature verification (`crypto` HMAC SHA256) protects transaction integrity.
* **Sub-Account Routing:** Supports Razorpay transfer splits, routing tuition funds directly to specific school branch accounts.
* **Transaction Ledger:** Keeps track of paid fees, payment IDs, amounts, and settlement statuses in the database.

### 📧 Automated Notice Alerts & Verification
* **Nodemailer SMTP System:** Automates notice distributions and system messages.
* **Email Verification:** Secured student profiles verified via a 6-digit OTP sent to their emails.
* **Smart Triggers:**
  * **Low Attendance Warnings:** If a student's attendance in a subject drops below 70%, the system automatically posts an academic notice and shoots an email alert to the student.
  * **Low Marks Alert:** If test scores drop below 35/100, a warning notice and email encourage them to seek academic support.

---

## 👨‍💻 Role-Based Dashboards

### 👨‍💼 Admin Dashboard
* **Data Management:** Add, edit, and remove students, teachers, subjects, and classes.
* **Analytics Center:** Visualize attendance trends, enrollment rates, and subject distributions.
* **Notice Board:** Create global announcements or class-specific alerts with automatic email delivery.
* **Fee Settings:** Set up tuition structures, assign fee records, and monitor collection statuses.

### 👨‍🏫 Teacher Dashboard
* **Attendance Registry:** Take and edit subject attendance.
* **Grading Panel:** Input and modify subject marks.
* **Virtual Classes:** Launch classrooms, manage presets, and moderate live WebRTC video rooms.
* **Performance Insights:** Monitor student progress and class-wide performance metrics.

### 👨‍🎓 Student Dashboard
* **Academic Analytics:** View subject performance and attendance percentages using visual charts.
* **Payment Center:** Check outstanding balances and securely pay tuition fees online.
* **Doubt Box:** Ask questions to the AI tutor.
* **Classroom Portal:** Get real-time class invites, join active sessions, and review notice boards.

---

## 🛠 Tech Stack

### Frontend
* **UI Library:** React.js (v18.3)
* **Routing:** React Router DOM (v7.17)
* **State Management:** Redux Toolkit & React-Redux
* **Design & Styling:** TailwindCSS (v4.0), Material UI (MUI v5.15), Styled Components, Framer Motion
* **Real-time Clients:** Socket.io-client (v4.8), WebRTC API (`RTCPeerConnection`, `getDisplayMedia`)
* **Visualization & Math:** Recharts (Data Graphs), React Markdown, Rehype-Katex, KaTeX (Math rendering)

### Backend & Core APIs
* **Runtime:** Node.js (v20+)
* **Framework:** Express.js (v5.2)
* **Real-time Engine:** Socket.io (v4.8)
* **AI Engine:** Groq SDK (Llama 3.3 model orchestration)
* **Payments & Billing:** Razorpay NodeJS SDK
* **Notifications:** Nodemailer (SMTP/Gmail client)
* **Security:** JWT (JSON Web Tokens), Bcryptjs

### Database
* **Database engine:** MongoDB Atlas
* **ORM:** Mongoose (v9.6)

---

## 📂 Project Structure

```bash
axiora/
│
├── frontend/                     # React Single Page Application (SPA)
│   ├── src/
│   │   ├── assets/              # Icons, illustrations, static files
│   │   ├── components/          # Reusable UI elements (Buttons, Tables, Loaders)
│   │   ├── redux/               # Redux slices, store configure, and actions
│   │   └── pages/               # Application pages and modules
│   │       ├── admin/           # Admin views, student/teacher managers, profiles
│   │       ├── teacher/         # Grading, class sessions, registries
│   │       ├── student/         # Analytics, payment desk, AI solvers, complaints
│   │       └── MeetingRoom.jsx  # WebRTC Video Room component & signaling
│   ├── public/
│   ├── vercel.json              # Vercel deep-routing rewrites
│   ├── vite.config.js
│   └── package.json
│
├── backend/                      # Node.js + Express REST API & WebSockets
│   ├── controllers/             # Request handlers (auth, fees, notices, WebRTC)
│   ├── middleware/              # Auth interceptors & custom middle logic
│   ├── models/                  # MongoDB Mongoose schemas
│   ├── routes/                  # Express endpoints registry
│   ├── index.js                 # Server entry point & Socket.io controllers
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Sumit-Tiwari830/Axiora.git
cd Axiora
```

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file inside the `backend` folder:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signing_secret_key
   
   # AI Doubt Solver
   GROQ_API_KEY=your_groq_api_token
   
   # Automated Email Notifications
   EMAIL_USER=your_gmail_sender_address@gmail.com
   EMAIL_PASS=your_gmail_app_password
   
   # Razorpay Payments
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
3. Start the backend in development mode:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   npm install
   ```
2. Create a `.env` file inside the `frontend` folder:
   ```env
   VITE_REACT_APP_BASE_URL=http://localhost:5000
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *The client application should now be running locally at `http://localhost:5173`.*

---

## 🌐 Deployment Guidelines

### Backend (Render / VPS)
* Set up a Web Service on Render.
* In **Environment Variables**, define:
  * `MONGO_URL`
  * `JWT_SECRET`
  * `PORT`
  * `GROQ_API_KEY`
  * `EMAIL_USER`
  * `EMAIL_PASS`
  * `RAZORPAY_KEY_ID`
  * `RAZORPAY_KEY_SECRET`
* Build Command: `npm install`
* Start Command: `npm start`

### Frontend (Vercel)
* Import the repository to Vercel.
* Set the Root Directory to `frontend`.
* Add the environment variable:
  * `VITE_REACT_APP_BASE_URL` = `https://your-backend-service.onrender.com`
* Build Command: `npm run build`
* Output Directory: `dist`
* **SPA Routing Alert:** To prevent `404` errors when reloading direct URLs, make sure the `vercel.json` file is present in the root folder with the following rewrite settings:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create.

1. Fork the Project.
2. Create your Feature Branch: `git checkout -b feature/AmazingFeature`
3. Commit your Changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the Branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Developer & Credits

* **Developer:** Sumit Tiwari
* **Project Repository:** [https://github.com/Sumit-Tiwari830/Axiora](https://github.com/Sumit-Tiwari830/Axiora)

*Axiora — Empowering Educational Management Through Technology.*

⭐ *If you found this project helpful, consider giving it a star on GitHub!*
