# 🎓 Axiora – School Management System

<p align="center">
  <h1 align="center">Axiora</h1>
  <h3 align="center">
    Modern School Management Platform Built with MERN Stack
  </h3>
</p>

<p align="center">
Manage students, teachers, classes, attendance, examinations, and academic records through a centralized dashboard.
</p>

---

## 🚀 Live Demo

### Frontend
https://axiora-psi.vercel.app

### Backend API
https://axiora-wf0q.onrender.com

---

## 📖 About

Axiora is a full-stack School Management System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

The platform simplifies educational administration by providing dedicated dashboards for administrators, teachers, and students. It enables efficient management of academic records, attendance tracking, performance monitoring, and classroom organization through an intuitive web interface.

---

## ✨ Features

### 👨‍💼 Admin Dashboard

- Add, update, and manage students
- Add and manage teachers
- Create and manage classes
- Create and manage subjects
- Monitor attendance records
- Manage school data centrally
- Dashboard analytics

### 👨‍🏫 Teacher Dashboard

- Take student attendance
- Manage assigned classes
- Upload marks and grades
- Monitor student performance
- View subject details

### 👨‍🎓 Student Dashboard

- View attendance records
- Check examination results
- Monitor academic progress
- View class and subject information
- Analyze performance through charts and statistics

---

## 🛠 Tech Stack

### Frontend

- React.js
- Redux Toolkit
- Material UI
- Styled Components
- React Router

### Backend

- Node.js
- Express.js
- JWT Authentication

### Database

- MongoDB Atlas

### Deployment

- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## 📂 Project Structure

```bash
axiora/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/Sumit-Tiwari830/Axiora.git

cd Axiora
```

---

### 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend folder:

```env
MONGO_URL=your_mongodb_connection_string

SECRET_KEY=your_secret_key

PORT=5000
```

Start Backend:

```bash
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_BASE_URL=http://localhost:5000
```

Start Frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## 🌐 Deployment

### Backend Deployment (Render)

Environment Variables:

```env
MONGO_URL=your_mongodb_connection_string

SECRET_KEY=your_secret_key
```

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

---

### Frontend Deployment (Vercel)

Environment Variable:

```env
VITE_BASE_URL=https://your-render-backend-url.onrender.com
```

Build Command:

```bash
npm run build
```

Output Directory:

```bash
dist
```

---

## 🔐 Authentication

Axiora uses:

- JWT Authentication
- Protected Routes
- Role-Based Access Control

### User Roles

- Admin
- Teacher
- Student

---

## 📊 Modules

### Student Management

- Add Students
- Edit Student Records
- Delete Students
- View Student Information

### Teacher Management

- Add Teachers
- Manage Teacher Information
- Assign Classes and Subjects

### Attendance Management

- Mark Attendance
- View Attendance Reports
- Track Student Presence

### Examination Management

- Upload Marks
- Manage Results
- Monitor Academic Performance

### Dashboard Analytics

- Attendance Statistics
- Academic Insights
- Student Performance Reports

---

## 🚀 Future Enhancements

- Parent Portal
- Fee Management System
- Timetable Management
- Assignment Submission
- Email Notifications
- Report Card Generation
- Real-Time Messaging

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

### Sumit Tiwari

Axiora — Empowering Educational Management Through Technology.

⭐ If you found this project helpful, consider giving it a star.
