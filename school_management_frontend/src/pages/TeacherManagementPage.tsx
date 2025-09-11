import { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, TextField, Paper } from '@mui/material';
import { DataGrid, type GridColDef, type GridRowId } from '@mui/x-data-grid';
import { getAllTeachers, createTeacher, updateTeacher, deleteTeacher, type TeacherDto, type CreateTeacherDto } from '../services/teacherService';

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

function TeacherManagementPage() {
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Partial<CreateTeacherDto> & { id?: number }>({});

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await getAllTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Öğretmenler yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleOpen = (teacher?: TeacherDto) => {
    if (teacher) {
      setIsEdit(true);
      setCurrentTeacher(teacher);
    } else {
      setIsEdit(false);
      setCurrentTeacher({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTeacher({});
  };

  const handleDelete = async (id: GridRowId) => {
    if (window.confirm('Bu öğretmeni silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTeacher(Number(id));
        fetchTeachers(); // Listeyi yenile
      } catch (error) {
        console.error('Öğretmen silinirken hata:', error);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTeacher({ ...currentTeacher, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && currentTeacher.id) {
        await updateTeacher(currentTeacher.id, currentTeacher as CreateTeacherDto);
      } else {
        await createTeacher(currentTeacher as CreateTeacherDto);
      }
      fetchTeachers(); // Listeyi yenile
      handleClose();
    } catch (error) {
      console.error('Öğretmen kaydedilirken hata:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'firstName', headerName: 'Adı', width: 150 },
    { field: 'lastName', headerName: 'Soyadı', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Button size="small" onClick={() => handleOpen(params.row as TeacherDto)}>Düzenle</Button>
          <Button size="small" color="error" onClick={() => handleDelete(params.id)}>Sil</Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Öğretmen Yönetimi</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>Yeni Öğretmen Ekle</Button>
      </Box>
      <DataGrid
        rows={teachers}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      />
      <Modal open={open} onClose={handleClose}>
        <Paper sx={modalStyle}>
          <Typography variant="h6" component="h2">{isEdit ? 'Öğretmen Düzenle' : 'Yeni Öğretmen'}</Typography>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
            <TextField name="firstName" label="Adı" value={currentTeacher.firstName || ''} onChange={handleFormChange} fullWidth margin="normal" required />
            <TextField name="lastName" label="Soyadı" value={currentTeacher.lastName || ''} onChange={handleFormChange} fullWidth margin="normal" required />
            <TextField name="email" label="Email" type="email" value={currentTeacher.email || ''} onChange={handleFormChange} fullWidth margin="normal" required />
            {!isEdit && <TextField name="password" label="Şifre" type="password" onChange={handleFormChange} fullWidth margin="normal" required />}
            <TextField name="phone" label="Telefon (İsteğe Bağlı)" value={currentTeacher.phone || ''} onChange={handleFormChange} fullWidth margin="normal" />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>İptal</Button>
              <Button type="submit" variant="contained">{isEdit ? 'Güncelle' : 'Oluştur'}</Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default TeacherManagementPage;