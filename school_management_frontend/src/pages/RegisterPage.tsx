import { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function RegisterPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'Student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && user.role === 'Teacher') {
      setFormData(prev => ({ ...prev, role: 'Student' }));
    } else if (user && user.role === 'Admin') {
      setFormData(prev => ({ ...prev, role: 'Student' }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: any) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register', formData);
      setSuccess('Kayıt başarıyla tamamlandı!');
      // Formu temizle
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: user?.role === 'Admin' ? 'Student' : 'Student' 
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 4, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Yeni Kullanıcı Kaydet
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
          
          <TextField margin="normal" required fullWidth id="firstName" label="Adı" name="firstName" value={formData.firstName} onChange={handleChange} />
          <TextField margin="normal" required fullWidth id="lastName" label="Soyadı" name="lastName" value={formData.lastName} onChange={handleChange} />
          <TextField margin="normal" required fullWidth id="email" label="Email Adresi" name="email" type="email" value={formData.email} onChange={handleChange} />
          <TextField margin="normal" required fullWidth id="password" label="Şifre" name="password" type="password" value={formData.password} onChange={handleChange} />
          <TextField margin="normal" fullWidth id="phone" label="Telefon (İsteğe Bağlı)" name="phone" value={formData.phone} onChange={handleChange} />
          
          {user && user.role === 'Admin' && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Rol"
                onChange={handleRoleChange}
              >
                <MenuItem value="Student">Öğrenci</MenuItem>
                <MenuItem value="Teacher">Öğretmen</MenuItem>
              </Select>
            </FormControl>
          )}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Kullanıcıyı Kaydet
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
