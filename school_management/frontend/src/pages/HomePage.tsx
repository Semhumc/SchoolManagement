import { Box, Typography, Card, CardContent } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { People, School, Class, BarChart, EventAvailable, PersonAdd } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function HomePage() {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'Admin':
        return 'Admin Paneline Hoş Geldiniz';
      case 'Teacher':
        return 'Öğretmen Paneline Hoş Geldiniz';
      case 'Student':
        return 'Öğrenci Paneline Hoş Geldiniz';
      default:
        return 'Okul Yönetim Sistemine Hoş Geldiniz';
    }
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'Admin':
        return [
          { title: 'Öğrenci Yönetimi', description: 'Öğrenci ekle, düzenle, sil', icon: <People fontSize="large" />, color: '#1976d2', path: '/students' },
          { title: 'Öğretmen Yönetimi', description: 'Öğretmen ekle, düzenle, sil', icon: <School fontSize="large" />, color: '#388e3c', path: '/teachers' },
          { title: 'Ders Yönetimi', description: 'Ders ekle, düzenle, sil', icon: <Class fontSize="large" />, color: '#f57c00', path: '/classes' },
          { title: 'Kullanıcı Kayıt', description: 'Sisteme yeni kullanıcı ekle', icon: <PersonAdd fontSize="large" />, color: '#9c27b0', path: '/register' }, // Varsayımsal bir kayıt yolu
        ];
      case 'Teacher':
        return [
          { title: 'Derslerim', description: 'Sorumlu olduğum dersleri görüntüle', icon: <Class fontSize="large" />, color: '#1976d2', path: '/my-classes' },
          { title: 'Öğrencilerim', description: 'Tüm öğrencileri görüntüle', icon: <People fontSize="large" />, color: '#388e3c', path: '/students' },
          { title: 'Not & Yorum', description: 'Öğrencilere not ve yorum ekle', icon: <BarChart fontSize="large" />, color: '#f57c00', path: '/classes/1/students' }, // Örnek bir ders ID'si
        ];
      case 'Student':
        return [
          { title: 'Ders Programım', description: 'Kayıtlı olduğum dersleri gör', icon: <Class fontSize="large" />, color: '#1976d2', path: '/my-schedule' },
          { title: 'Notlarım', description: 'Aldığım notları görüntüle', icon: <BarChart fontSize="large" />, color: '#388e3c', path: '/my-scores' },
          { title: 'Devamsızlık', description: 'Devamsızlık durumumu kontrol et', icon: <EventAvailable fontSize="large" />, color: '#f57c00', path: '/my-attendance' },
          { title: 'Yorumlarım', description: 'Hakkımdaki yorumları gör', icon: <People fontSize="large" />, color: '#9c27b0', path: '/my-comments' },
        ];
      default:
        return [];
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: 'primary.main' }}>
        {getWelcomeMessage()}
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
        Hoş geldiniz, {user?.email}!
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {getMenuItems().map((item, index) => (
          <Box key={index} sx={{
            width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Link to={item.path} style={{ textDecoration: 'none', flexGrow: 1 }}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ color: item.color, mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Sistem Özellikleri
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bu okul yönetim sistemi ile öğrenci, öğretmen ve admin rollerine özel işlemler gerçekleştirebilirsiniz. 
          Sistemde not girişi, devamsızlık takibi, ders yönetimi ve kullanıcı yönetimi gibi temel özellikler bulunmaktadır.
        </Typography>
      </Box>
    </Box>
  );
}

export default HomePage;