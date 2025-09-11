
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, TextField, Paper } from '@mui/material';
import { DataGrid, type GridColDef, type GridRowId } from '@mui/x-data-grid';
import { getAllStudents, createStudent, updateStudent, deleteStudent, type StudentDto, type CreateStudentDto } from '../services/studentService';

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

function StudentManagementPage() {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<CreateStudentDto> & { id?: number }>({});

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Öğrenciler yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpen = (student?: StudentDto) => {
    if (student) {
      setIsEdit(true);
      setCurrentStudent(student);
    } else {
      setIsEdit(false);
      setCurrentStudent({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentStudent({});
  };

  const handleDelete = async (id: GridRowId) => {
    if (window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteStudent(Number(id));
        fetchStudents(); // Listeyi yenile
      } catch (error) {
        console.error('Öğrenci silinirken hata:', error);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStudent({ ...currentStudent, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && currentStudent.id) {
        await updateStudent(currentStudent.id, currentStudent as CreateStudentDto);
      } else {
        await createStudent(currentStudent as CreateStudentDto);
      }
      fetchStudents(); // Listeyi yenile
      handleClose();
    } catch (error) {
      console.error('Öğrenci kaydedilirken hata:', error);
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
          <Button size="small" onClick={() => handleOpen(params.row as StudentDto)}>Düzenle</Button>
          <Button size="small" color="error" onClick={() => handleDelete(params.id)}>Sil</Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Öğrenci Yönetimi</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>Yeni Öğrenci Ekle</Button>
      </Box>
      <DataGrid
        rows={students}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      />
      <Modal open={open} onClose={handleClose}>
        <Paper sx={modalStyle}>
          <Typography variant="h6" component="h2">{isEdit ? 'Öğrenci Düzenle' : 'Yeni Öğrenci'}</Typography>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
            <TextField name="firstName" label="Adı" value={currentStudent.firstName || ''} onChange={handleFormChange} fullWidth margin="normal" required />
            <TextField name="lastName" label="Soyadı" value={currentStudent.lastName || ''} onChange={handleFormChange} fullWidth margin="normal" required />
            <TextField name="email" label="Email" type="email" value={currentStudent.email || ''} onChange={handleFormChange} fullWidth margin="normal" required />
            {!isEdit && <TextField name="password" label="Şifre" type="password" onChange={handleFormChange} fullWidth margin="normal" required />}
            <TextField name="phone" label="Telefon (İsteğe Bağlı)" value={currentStudent.phone || ''} onChange={handleFormChange} fullWidth margin="normal" />
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

export default StudentManagementPage;
