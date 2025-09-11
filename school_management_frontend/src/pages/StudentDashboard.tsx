import { Routes, Route, Navigate } from 'react-router-dom';
import MyScoresPage from './student/MyScoresPage';
import MyAttendancePage from './student/MyAttendancePage';
import MySchedulePage from './student/MySchedulePage';
import MyCommentsPage from './student/MyCommentsPage';
import HomePage from './HomePage';

function StudentDashboard() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/my-scores" element={<MyScoresPage />} />
      <Route path="/my-attendance" element={<MyAttendancePage />} />
      <Route path="/my-schedule" element={<MySchedulePage />} />
      <Route path="/my-comments" element={<MyCommentsPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default StudentDashboard;