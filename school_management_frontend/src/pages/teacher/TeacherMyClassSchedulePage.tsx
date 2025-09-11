import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import {
  getMyClassSchedules,
  updateClassScheduleStatus,
  type ClassScheduleDto,
} from '../../services/classScheduleService';
import { markAttendance, type CreateAttendanceDto } from '../../services/attendanceService';
import { getStudentsByClassId, type StudentDto } from '../../services/studentService';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function TeacherMyClassSchedulePage() {
  const [schedules, setSchedules] = useState<ClassScheduleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [currentClassSchedule, setCurrentClassSchedule] = useState<ClassScheduleDto | null>(null);
  const [studentsInClass, setStudentsInClass] = useState<StudentDto[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<{ studentId: number; isPresent: boolean }[]>([]);

  const fetchMySchedules = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyClassSchedules();
      setSchedules(data);
    } catch (error) {
      console.error('Ders programları yüklenirken hata oluştu:', error);
      setError('Ders programları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySchedules();
  }, []);

  const handleOpenAttendanceModal = async (schedule: ClassScheduleDto) => {
    setCurrentClassSchedule(schedule);
    try {
      const students = await getStudentsByClassId(schedule.classId);
      setStudentsInClass(students);
      setAttendanceRecords(students.map(s => ({ studentId: s.id, isPresent: true }))); // Default to present
      setAttendanceModalOpen(true);
    } catch (error) {
      console.error('Öğrenciler yüklenirken hata oluştu:', error);
      setError('Öğrenciler yüklenirken bir hata oluştu.');
    }
  };

  const handleCloseAttendanceModal = () => {
    setAttendanceModalOpen(false);
    setCurrentClassSchedule(null);
    setStudentsInClass([]);
    setAttendanceRecords([]);
    setError('');
  };

  const handleAttendanceChange = (studentId: number, isPresent: boolean) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId ? { ...record, isPresent } : record
      )
    );
  };

  const handleSubmitAttendance = async () => {
    if (!currentClassSchedule) return;

    try {
      setSuccess('');
      setError('');
      for (const record of attendanceRecords) {
        const dto: CreateAttendanceDto = {
          studentId: record.studentId,
          classScheduleId: currentClassSchedule.id,
          isPresent: record.isPresent,
        };
        await markAttendance(dto);
      }
      setSuccess('Devamsızlık başarıyla kaydedildi.');
      handleCloseAttendanceModal();
      fetchMySchedules(); // Refresh schedules
    } catch (error) {
      console.error('Devamsızlık kaydedilirken hata oluştu:', error);
      setError('Devamsızlık kaydedilirken bir hata oluştu.');
    }
  };

  const handleUpdateStatus = async (scheduleId: number, newStatus: string) => {
    try {
      setSuccess('');
      setError('');
      await updateClassScheduleStatus(scheduleId, newStatus);
      setSuccess('Ders durumu başarıyla güncellendi.');
      fetchMySchedules(); // Refresh schedules
    } catch (error) {
      console.error('Ders durumu güncellenirken hata oluştu:', error);
      setError('Ders durumu güncellenirken bir hata oluştu.');
    }
  };

  const columns: GridColDef<ClassScheduleDto>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
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
      width: 250,
      sortable: false,
      renderCell: (params: GridRenderCellParams<ClassScheduleDto>) => (
        <Box>
          <Button size="small" onClick={() => handleOpenAttendanceModal(params.row)}>
            Devamsızlık Al
          </Button>
          <FormControl size="small" sx={{ ml: 1, minWidth: 120 }}>
            <InputLabel>Durum</InputLabel>
            <Select
              value={params.row.status || ''} // Assuming status field exists in ClassScheduleDto
              label="Durum"
              onChange={(e) => handleUpdateStatus(params.row.id, e.target.value as string)}
            >
              <MenuItem value="start">Başladı</MenuItem>
              <MenuItem value="present">Devam Ediyor</MenuItem>
              <MenuItem value="finish">Bitti</MenuItem>
            </Select>
          </FormControl>
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
        <Typography variant="h5">Ders Programım</Typography>
        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
      </Box>

      <DataGrid
        rows={schedules}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        sx={{ height: '100%', minHeight: 300 }}
      />

      <Modal open={attendanceModalOpen} onClose={handleCloseAttendanceModal}>
        <Paper sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Devamsızlık Al - {currentClassSchedule?.className}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box>
            {studentsInClass.map(student => (
              <Box key={student.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography>{`${student.firstName} ${student.lastName}`}</Typography>
                <Select
                  value={attendanceRecords.find(rec => rec.studentId === student.id)?.isPresent ? 'present' : 'absent'}
                  onChange={(e) => handleAttendanceChange(student.id, e.target.value === 'present')}
                  size="small"
                >
                  <MenuItem value="present">Geldi</MenuItem>
                  <MenuItem value="absent">Gelmedi</MenuItem>
                </Select>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={handleCloseAttendanceModal}>İptal</Button>
            <Button variant="contained" onClick={handleSubmitAttendance}>Kaydet</Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default TeacherMyClassSchedulePage;