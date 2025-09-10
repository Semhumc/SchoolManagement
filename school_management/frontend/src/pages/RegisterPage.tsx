import { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
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
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await api.post('/auth/register', formData);
      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 4, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Kayıt Ol
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="Adı"
            name="firstName"
            autoFocus
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Soyadı"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Adresi"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Şifre"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="phone"
            label="Telefon (İsteğe Bağlı)"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Rol</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={formData.role}
              label="Rol"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <MenuItem value="Student">Öğrenci</MenuItem>
              <MenuItem value="Teacher">Öğretmen</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Kayıt Ol
          </Button>
          <Box textAlign="center">
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Zaten hesabınız var mı? Giriş yapın
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;