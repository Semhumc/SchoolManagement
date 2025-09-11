import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    // Henüz kullanıcı bilgisi yüklenmediyse veya giriş yapılmadıysa boş bir ekran göster
    // useEffect yönlendirmeyi yapacaktır.
    return null;
  }

  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Teacher':
        return <TeacherDashboard />;
      case 'Student':
        return <StudentDashboard />;
      default:
        return <div>Bilinmeyen rol. Lütfen çıkış yapıp tekrar deneyin.</div>;
    }
  };

  return <DashboardLayout>{renderDashboardByRole()}</DashboardLayout>;
}

export default Dashboard;