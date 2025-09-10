import { Routes, Route, Navigate } from 'react-router-dom';
import StudentManagementPage from './StudentManagementPage';
import TeacherManagementPage from './TeacherManagementPage';
import ClassManagementPage from './admin/ClassManagementPage';
import HomePage from './HomePage'; // Genel bir karşılama sayfası

function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/students" element={<StudentManagementPage />} />
      <Route path="/teachers" element={<TeacherManagementPage />} />
      <Route path="/classes" element={<ClassManagementPage />} />
      {/* Diğer admin sayfaları buraya eklenebilir */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AdminDashboard;