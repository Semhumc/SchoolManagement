import { Routes, Route, Navigate } from 'react-router-dom';
import MyClassesPage from './teacher/MyClassesPage';
import ClassStudentsPage from './teacher/ClassStudentsPage';
import TakeAttendancePage from './teacher/TakeAttendancePage';
import HomePage from './HomePage';

function TeacherDashboard() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/my-classes" element={<MyClassesPage />} />
      <Route path="/classes/:classId/students" element={<ClassStudentsPage />} />
      <Route path="/classes/:classId/attendance" element={<TakeAttendancePage />} />
      {/* 
        Öğretmenin tüm öğrencileri görebileceği bir sayfa da eklenebilir.
        <Route path="/students" element={<StudentListPage />} /> 
      */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default TeacherDashboard;