
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider, Autocomplete, TextField, Modal, Paper, IconButton } from '@mui/material';
import { AddComment, NoteAdd } from '@mui/icons-material';
import { getAllStudents, type StudentDto } from '../../services/studentService';
import { addStudentToClass, removeStudentFromClass } from '../../services/classService';
import { addScore } from '../../services/scoreService';
import { addComment } from '../../services/commentService';

const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 };

function ClassStudentsPage() {
  const { classId } = useParams<{ classId: string }>();
  const location = useLocation();
  const { className } = location.state as { className: string };

  const [classStudents, setClassStudents] = useState<StudentDto[]>([]);
  const [otherStudents, setOtherStudents] = useState<StudentDto[]>([]);
  const [studentToAdd, setStudentToAdd] = useState<StudentDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal state'leri
  const [modalType, setModalType] = useState<'score' | 'comment' | null>(null);
  const [currentTargetStudent, setCurrentTargetStudent] = useState<StudentDto | null>(null);
  const [modalValue, setModalValue] = useState('');

  useEffect(() => {
    const initialFetch = async () => {
        setLoading(true);
        try {
            const all = await getAllStudents();
            const { studentNames } = location.state as { studentNames: string[] };
            setClassStudents(all.filter(s => studentNames.includes(`${s.firstName} ${s.lastName}`)));
            setOtherStudents(all.filter(s => !studentNames.includes(`${s.firstName} ${s.lastName}`)));
        } catch (e) {
            console.error("Öğrenciler yüklenemedi", e);
        }
        setLoading(false);
    }
    initialFetch();
  }, [classId, location.state]);

  const handleModalOpen = (type: 'score' | 'comment', student: StudentDto) => {
    setModalType(type);
    setCurrentTargetStudent(student);
    setModalValue('');
  };
  const handleModalClose = () => setModalType(null);

  const handleModalSubmit = async () => {
    if (!modalValue || !currentTargetStudent || !classId) return;
    try {
      if (modalType === 'score') {
        await addScore({ studentId: currentTargetStudent.id, classId: Number(classId), value: Number(modalValue) });
      } else if (modalType === 'comment') {
        await addComment({ studentId: currentTargetStudent.id, classId: Number(classId), commentText: modalValue });
      }
      alert(`${modalType === 'score' ? 'Not' : 'Yorum'} başarıyla eklendi!`);
      handleModalClose();
    } catch (error) {
      console.error(`Error adding ${modalType}:`, error);
      alert('İşlem sırasında bir hata oluştu.');
    }
  };

  const handleAddStudent = async () => {
    if (!studentToAdd || !classId) return;
    try {
      await addStudentToClass(Number(classId), studentToAdd.id);
      setClassStudents([...classStudents, studentToAdd]);
      setOtherStudents(otherStudents.filter(s => s.id !== studentToAdd.id));
      setStudentToAdd(null);
    } catch (error) { console.error("Öğrenci eklenirken hata:", error); }
  };

  const handleRemoveStudent = async (student: StudentDto) => {
    if (!classId) return;
    try {
      await removeStudentFromClass(Number(classId), student.id);
      setOtherStudents([...otherStudents, student]);
      setClassStudents(classStudents.filter(s => s.id !== student.id));
    } catch (error) { console.error("Öğrenci çıkarılırken hata:", error); }
  };

  if (loading) return <Typography>Yükleniyor...</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>{className} - Öğrenci Listesi</Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Derse Öğrenci Ekle</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Autocomplete options={otherStudents} getOptionLabel={(o) => `${o.firstName} ${o.lastName}`} style={{ width: 300 }} value={studentToAdd} onChange={(_, v) => setStudentToAdd(v)} renderInput={(params) => <TextField {...params} label="Öğrenci Seç" />} />
          <Button onClick={handleAddStudent} variant="contained" sx={{ ml: 2 }} disabled={!studentToAdd}>Ekle</Button>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6">Dersteki Öğrenciler ({classStudents.length})</Typography>
      <List>
        {classStudents.map(student => (
          <ListItem key={student.id} secondaryAction={
            <Box>
              <IconButton title="Not Ekle" onClick={() => handleModalOpen('score', student)}><NoteAdd /></IconButton>
              <IconButton title="Yorum Ekle" onClick={() => handleModalOpen('comment', student)}><AddComment /></IconButton>
              <Button color="error" onClick={() => handleRemoveStudent(student)} sx={{ ml: 2 }}>Dersten Çıkar</Button>
            </Box>
          }>
            <ListItemText primary={`${student.firstName} ${student.lastName}`} secondary={student.email} />
          </ListItem>
        ))}
      </List>

      {/* Generic Modal for Adding Score/Comment */}
      <Modal open={!!modalType} onClose={handleModalClose}>
        <Paper sx={modalStyle}>
          <Typography variant="h6">{`Yeni ${modalType === 'score' ? 'Not' : 'Yorum'} Ekle`}</Typography>
          <Typography variant="body2">Öğrenci: {currentTargetStudent?.firstName} {currentTargetStudent?.lastName}</Typography>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleModalSubmit(); }} sx={{ mt: 2 }}>
            <TextField label={modalType === 'score' ? 'Not (0-100)' : 'Yorum'} type={modalType === 'score' ? 'number' : 'text'} value={modalValue} onChange={(e) => setModalValue(e.target.value)} fullWidth required multiline={modalType === 'comment'} rows={4} />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleModalClose} sx={{ mr: 1 }}>İptal</Button>
              <Button type="submit" variant="contained">Ekle</Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default ClassStudentsPage;
