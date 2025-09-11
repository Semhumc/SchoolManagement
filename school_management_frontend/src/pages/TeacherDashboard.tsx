import { Routes, Route, Navigate } from 'react-router-dom';
import MyClassesPage from './teacher/MyClassesPage';
import ClassStudentsPage from './teacher/ClassStudentsPage';
import TakeAttendancePage from './teacher/TakeAttendancePage';
import StudentsListPage from './student/StudentsListPage';
import TeacherMyClassSchedulePage from './teacher/TeacherMyClassSchedulePage';
import HomePage from './HomePage';

function TeacherDashboard() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/my-classes" element={<MyClassesPage />} />
      <Route path="/students" element={<StudentsListPage />} />
      <Route path="/classes/:classId/students" element={<ClassStudentsPage />} />
      <Route path="/classes/:classId/attendance" element={<TakeAttendancePage />} />
      <Route path="/my-schedules" element={<TeacherMyClassSchedulePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default TeacherDashboard;