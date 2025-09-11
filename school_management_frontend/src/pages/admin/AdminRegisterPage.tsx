import { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import api from '../../services/api';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function AdminRegisterPage() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'Student'
  });
  const [message, setMessage] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      role: 'Student'
    });
    setMessage('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      setMessage('Kullanıcı başarıyla kaydedildi!');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Kullanıcı Kayıt</Typography>
        <Button variant="contained" onClick={handleOpen}>Yeni Kullanıcı Ekle</Button>
      </Box>
      
      <Typography variant="body1">
        Buradan sisteme yeni kullanıcılar (öğrenci, öğretmen veya admin) ekleyebilirsiniz.
      </Typography>

      <Modal open={open} onClose={handleClose}>
        <Paper sx={modalStyle}>
          <Typography variant="h6" component="h2">Yeni Kullanıcı Ekle</Typography>
          {message && (
            <Typography 
              color={message.includes('başarıyla') ? 'green' : 'red'} 
              sx={{ mt: 1, mb: 2 }}
            >
              {message}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField 
              name="firstName" 
              label="Adı" 
              value={formData.firstName} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              required 
            />
            <TextField 
              name="lastName" 
              label="Soyadı" 
              value={formData.lastName} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              required 
            />
            <TextField 
              name="email" 
              label="Email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              required 
            />
            <TextField 
              name="password" 
              label="Şifre" 
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              required 
            />
            <TextField 
              name="phone" 
              label="Telefon (İsteğe Bağlı)" 
              value={formData.phone} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                value={formData.role}
                label="Rol"
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <MenuItem value="Student">Öğrenci</MenuItem>
                <MenuItem value="Teacher">Öğretmen</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>İptal</Button>
              <Button type="submit" variant="contained">Kaydet</Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default AdminRegisterPage;