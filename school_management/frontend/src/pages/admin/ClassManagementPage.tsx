
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, TextField, Paper } from '@mui/material';
import { DataGrid, type GridColDef, type GridRowId, type GridRenderCellParams } from '@mui/x-data-grid';
import { getAllClasses, createClass, deleteClass, type ClassDto } from '../../services/classService';

const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 };

function ClassManagementPage() {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await getAllClasses();
      setClasses(data);
    } catch (error) {
      console.error("Dersler yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async (id: GridRowId) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz? Tüm ilişkili kayıtlar da etkilenebilir.')) {
      try {
        await deleteClass(Number(id));
        fetchClasses();
      } catch (error) { console.error('Ders silinirken hata:', error); }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClass({ className: newClassName });
      fetchClasses();
      setNewClassName('');
      handleClose();
    } catch (error) { console.error('Ders oluşturulurken hata:', error); }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'className', headerName: 'Ders Adı', flex: 1 },
    { field: 'studentCount', headerName: 'Öğrenci Sayısı', width: 150, valueGetter: (params: GridRenderCellParams<ClassDto>) => params.row.students.length },
    { field: 'teacherCount', headerName: 'Öğretmen Sayısı', width: 150, valueGetter: (params: GridRenderCellParams<ClassDto>) => params.row.teachers.length },
    {
      field: 'actions', headerName: 'İşlemler', width: 150, sortable: false,
      renderCell: (params) => <Button size="small" color="error" onClick={() => handleDelete(params.id)}>Sil</Button>,
    },
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Ders Yönetimi</Typography>
        <Button variant="contained" onClick={handleOpen}>Yeni Ders Ekle</Button>
      </Box>
      <DataGrid rows={classes} columns={columns} loading={loading} />
      <Modal open={open} onClose={handleClose}>
        <Paper sx={modalStyle}>
          <Typography variant="h6">Yeni Ders Oluştur</Typography>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
            <TextField label="Ders Adı" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} fullWidth required />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>İptal</Button>
              <Button type="submit" variant="contained">Oluştur</Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default ClassManagementPage;
