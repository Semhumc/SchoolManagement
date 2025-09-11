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
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowId, type GridRenderCellParams } from '@mui/x-data-grid';
import { getAllClasses, type ClassDto } from '../../services/classService';
import { getAllTeachers, type TeacherDto } from '../../services/teacherService';
import {
  getAllClassSchedules,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
  type ClassScheduleDto,
  type CreateClassScheduleDto,
} from '../../services/classScheduleService';

type TimeSpan = string;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function AdminClassScheduleManagementPage() {
  const [schedules, setSchedules] = useState<ClassScheduleDto[]>([]);
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<CreateClassScheduleDto & { id?: number }>({
    classId: 0,
    teacherId: 0,
    scheduleDate: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '09:00',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');
      const [scheduleData, classData, teacherData] = await Promise.all([
        getAllClassSchedules(),
        getAllClasses(),
        getAllTeachers(),
      ]);
      setSchedules(scheduleData);
      setClasses(classData);
      setTeachers(teacherData);
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
      setError('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpen = (schedule?: ClassScheduleDto) => {
    if (schedule) {
      setEditMode(true);
      setCurrentSchedule({
        id: schedule.classScheduleId, // Backend field adını kullan
        classId: schedule.classId,
        teacherId: schedule.teacherId,
        scheduleDate: schedule.scheduleDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      });
    } else {
      setEditMode(false);
      setCurrentSchedule({
        classId: 0,
        teacherId: 0,
        scheduleDate: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '09:00',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleDelete = async (id: GridRowId) => {
    if (window.confirm('Bu ders programını silmek istediğinizden emin misiniz?')) {
      try {
        setSuccess('');
        setError('');
        await deleteClassSchedule(Number(id));
        await fetchAllData();
        setSuccess('Ders programı başarıyla silindi');
      } catch (error) {
        console.error('Ders programı silinirken hata:', error);
        setError('Ders programı silinirken bir hata oluştu.');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSchedule.classId || !currentSchedule.teacherId) {
      setError('Tüm alanları doldurunuz.');
      return;
    }

    try {
      setSuccess('');
      setError('');
      if (editMode && currentSchedule.id) {
        await updateClassSchedule(currentSchedule.id, currentSchedule);
        setSuccess('Ders programı başarıyla güncellendi');
      } else {
        await createClassSchedule(currentSchedule);
        setSuccess('Ders programı başarıyla oluşturuldu');
      }
      await fetchAllData();
      handleClose();
    } catch (error) {
      console.error('Ders programı kaydedilirken hata:', error);
      setError('Ders programı kaydedilirken bir hata oluştu.');
    }
  };

  const columns: GridColDef<ClassScheduleDto>[] = [
    { field: 'classScheduleId', headerName: 'ID', width: 90 },
    { field: 'className', headerName: 'Ders Adı', flex: 1 },
    { field: 'teacherName', headerName: 'Öğretmen Adı', flex: 1 },
    {
      field: 'scheduleDate',
      headerName: 'Tarih',
      width: 150,
      valueGetter: (params: GridRenderCellParams<ClassScheduleDto>) => new Date(params.row.scheduleDate).toLocaleDateString(),
    },
    { field: 'startTime', headerName: 'Başlangıç Saati', width: 150 },
    { field: 'endTime', headerName: 'Bitiş Saati', width: 150 },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams<ClassScheduleDto>) => (
        <Box>
          <Button size="small" onClick={() => handleOpen(params.row)}>
            Düzenle
          </Button>
          <Button size="small" color="error" onClick={() => handleDelete(params.id)} sx={{ ml: 1 }}>
            Sil
          </Button>
        </Box>
      ),
    },
  ];

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
        <Typography variant="h5">Ders Programı Yönetimi</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Yeni Program Ekle
        </Button>
      </Box>

      <DataGrid
        rows={schedules}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.classScheduleId} // Doğru ID field'ını kullan
        sx={{ height: '100%', minHeight: 300 }}
      />

      <Modal open={open} onClose={handleClose}>
        <Paper sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editMode ? 'Ders Programını Düzenle' : 'Yeni Ders Programı Oluştur'}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Ders</InputLabel>
              <Select
                value={currentSchedule.classId}
                label="Ders"
                onChange={(e) =>
                  setCurrentSchedule({ ...currentSchedule, classId: Number(e.target.value) })
                }
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Öğretmen</InputLabel>
              <Select
                value={currentSchedule.teacherId}
                label="Öğretmen"
                onChange={(e) =>
                  setCurrentSchedule({ ...currentSchedule, teacherId: Number(e.target.value) })
                }
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {`${teacher.firstName} ${teacher.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Tarih"
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              value={currentSchedule.scheduleDate}
              onChange={(e) =>
                setCurrentSchedule({ ...currentSchedule, scheduleDate: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Başlangıç Saati"
              type="time"
              fullWidth
              sx={{ mb: 2 }}
              value={currentSchedule.startTime}
              onChange={(e) =>
                setCurrentSchedule({ ...currentSchedule, startTime: e.target.value as TimeSpan })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Bitiş Saati"
              type="time"
              fullWidth
              sx={{ mb: 2 }}
              value={currentSchedule.endTime}
              onChange={(e) =>
                setCurrentSchedule({ ...currentSchedule, endTime: e.target.value as TimeSpan })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleClose}>İptal</Button>
              <Button type="submit" variant="contained">
                {editMode ? 'Güncelle' : 'Oluştur'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default AdminClassScheduleManagementPage;