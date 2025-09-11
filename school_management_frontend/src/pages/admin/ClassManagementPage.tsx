import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Modal, 
  TextField, 
  Paper, 
  Select, 
  MenuItem, 
  OutlinedInput, 
  Checkbox, 
  ListItemText, 
  FormControl, 
  InputLabel,
  Alert,
  type SelectChangeEvent 
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowId } from '@mui/x-data-grid';
import { getAllClasses, createClass, deleteClass, type ClassDto, type CreateClassDto } from '../../services/classService';
import { getAllTeachers, type TeacherDto } from '../../services/teacherService';

const modalStyle = { 
  position: 'absolute', 
  top: '50%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)', 
  width: 400, 
  bgcolor: 'background.paper', 
  boxShadow: 24, 
  p: 4 
};

function ClassManagementPage() {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching classes and teachers...');
      
      const [classData, teacherData] = await Promise.all([getAllClasses(), getAllTeachers()]);
      
      console.log('Classes data:', classData);
      console.log('Teachers data:', teacherData);
      
      setClasses(classData);
      setTeachers(teacherData);
      setSuccess('Veriler başarıyla yüklendi');
    } catch (error) {
      console.error("Veriler yüklenirken hata oluştu:", error);
      setError('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAllData(); 
  }, []);

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    setNewClassName('');
    setSelectedTeacherIds([]);
    setError('');
  };

  const handleDelete = async (id: GridRowId) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteClass(Number(id));
        await fetchAllData(); // Listeyi yenile
        setSuccess('Ders başarıyla silindi');
      } catch (error) { 
        console.error('Ders silinirken hata:', error);
        setError('Ders silinirken bir hata oluştu.');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      setError('Ders adı boş olamaz.');
      return;
    }

    try {
      const createData: CreateClassDto = {
        className: newClassName,
        teacherIds: selectedTeacherIds
      };
      
      console.log('Creating class with data:', createData);
      await createClass(createData);
      await fetchAllData(); // Listeyi yenile
      handleClose();
      setSuccess('Ders başarıyla oluşturuldu');
    } catch (error) { 
      console.error('Ders oluşturulurken hata:', error);
      setError('Ders oluşturulurken bir hata oluştu.');
    }
  };

  const handleTeacherSelectChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setSelectedTeacherIds(typeof value === 'string' ? [] : value);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'className', headerName: 'Ders Adı', flex: 1 },
    { 
      field: 'studentCount', 
      headerName: 'Öğrenci Sayısı', 
      width: 150, 
      valueGetter: (params: { row: ClassDto }) => params.row.students?.length || 0
    },
    { 
      field: 'teacherCount', 
      headerName: 'Öğretmen Sayısı', 
      width: 150, 
      valueGetter: (params: { row: ClassDto }) => params.row.teachers?.length || 0
    },
    {
      field: 'actions', 
      headerName: 'İşlemler', 
      width: 150, 
      sortable: false,
      renderCell: (params) => (
        <Button 
          size="small" 
          color="error" 
          onClick={() => handleDelete(params.id)}
        >
          Sil
        </Button>
      ),
    },
  ];

  // Success mesajını otomatik temizle
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Ders Yönetimi</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Yeni Ders Ekle
        </Button>
      </Box>
      
      <DataGrid 
        rows={classes} 
        columns={columns} 
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        sx={{ height: '100%' }}
      />
      
      <Modal open={open} onClose={handleClose}>
        <Paper sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Yeni Ders Oluştur
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
            <TextField 
              label="Ders Adı" 
              value={newClassName} 
              onChange={(e) => setNewClassName(e.target.value)} 
              fullWidth 
              required 
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Öğretmenler</InputLabel>
              <Select
                multiple
                value={selectedTeacherIds}
                onChange={handleTeacherSelectChange}
                input={<OutlinedInput label="Öğretmenler" />}
                renderValue={(selected) => 
                  teachers
                    .filter(t => selected.includes(t.id))
                    .map(t => `${t.firstName} ${t.lastName}`)
                    .join(', ')
                }
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    <Checkbox checked={selectedTeacherIds.indexOf(teacher.id) > -1} />
                    <ListItemText primary={`${teacher.firstName} ${teacher.lastName}`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleClose}>
                İptal
              </Button>
              <Button type="submit" variant="contained">
                Oluştur
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default ClassManagementPage;