import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Homepage from "./pages/Homepage";
import ChooseUser from "./pages/ChooseUser";
import LoginPage from "./pages/LoginPage";

import AdminRegisterPage from "./pages/admin/AdminRegisterPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

const App = () => {
  const { currentRole } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      {currentRole === null ? (
        <Routes>
          <Route path="/" element={<Homepage />} />

          <Route
            path="/choose"
            element={<ChooseUser visitor="normal" />}
          />

          <Route
            path="/chooseasguest"
            element={<ChooseUser visitor="guest" />}
          />

          <Route
            path="/Adminlogin"
            element={<LoginPage role="Admin" />}
          />

          <Route
            path="/Studentlogin"
            element={<LoginPage role="Student" />}
          />

          <Route
            path="/Teacherlogin"
            element={<LoginPage role="Teacher" />}
          />

          <Route
            path="/Adminregister"
            element={<AdminRegisterPage />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      ) : currentRole === "Admin" ? (
        <AdminDashboard />
      ) : currentRole === "Student" ? (
        <StudentDashboard />
      ) : currentRole === "Teacher" ? (
        <TeacherDashboard />
      ) : (
        <Navigate to="/" replace />
      )}
    </BrowserRouter>
  );
};

export default App;