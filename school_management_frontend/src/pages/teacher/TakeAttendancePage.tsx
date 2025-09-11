
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, Checkbox, FormControlLabel } from '@mui/material';
import { getAllStudents, type StudentDto } from '../../services/studentService';
import { markAttendance } from '../../services/attendanceService';

function TakeAttendancePage() {
  const { classId } = useParams<{ classId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { className } = location.state as { className: string };

  const [classStudents, setClassStudents] = useState<StudentDto[]>([]);
  const [attendance, setAttendance] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const all = await getAllStudents();
        const { students: studentNames } = location.state as { students: string[] };
        const studentsInClass = all.filter(s => studentNames.includes(`${s.firstName} ${s.lastName}`));
        setClassStudents(studentsInClass);
        // Initialize attendance state: all present by default
        const initialAttendance = studentsInClass.reduce((acc: { [key: number]: boolean }, student) => {
          acc[student.id] = true;
          return acc;
        }, {});
        setAttendance(initialAttendance);
      } catch (e) {
        console.error("Öğrenciler yüklenemedi", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [classId, location.state]);

  const handleToggle = (studentId: number) => {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleSave = async () => {
    if (!classId) return;
    // Backend'de classScheduleId gerekiyor, şimdilik 1 varsayıyoruz.
    const classScheduleId = 1; 
    const promises = Object.entries(attendance).map(([studentId, isPresent]) => 
      markAttendance({ studentId: Number(studentId), classScheduleId, isPresent })
    );
    try {
      await Promise.all(promises);
      alert('Devamsızlık başarıyla kaydedildi!');
      navigate('/my-classes');
    } catch (error) {
      console.error("Devamsızlık kaydedilirken hata:", error);
      alert('Bir hata oluştu.');
    }
  };

  if (loading) return <Typography>Yükleniyor...</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>{className} - Devamsızlık</Typography>
      <Typography variant="subtitle1">Tarih: {new Date().toLocaleDateString('tr-TR')}</Typography>
      <List>
        {classStudents.map(student => (
          <ListItem key={student.id}>
            <FormControlLabel
              control={<Checkbox checked={attendance[student.id] || false} onChange={() => handleToggle(student.id)} />}
              label={`${student.firstName} ${student.lastName}`}
            />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>Devamsızlığı Kaydet</Button>
    </Box>
  );
}

export default TakeAttendancePage;
