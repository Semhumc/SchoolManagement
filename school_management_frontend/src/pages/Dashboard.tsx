import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import { Box, CircularProgress, Typography } from '@mui/material';

function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth(); // loading state'ini al
  const navigate = useNavigate();

  useEffect(() => {
    // Yükleme devam ediyorsa bir şey yapma, bekle
    if (loading) {
      return;
    }
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // AuthContext hala token kontrolü yapıyorsa yükleme ekranı göster
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Oturum kontrol ediliyor...</Typography>
      </Box>
    );
  }

  if (!user) {
    // Bu noktada loading bitmiş ama user hala yoksa, useEffect yönlendirmeyi zaten yapmıştır.
    // Yine de bir fallback olarak null dönebiliriz.
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