import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { getAllStudents, type StudentDto } from '../../services/studentService';

function StudentsListPage() {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchStudents();
  }, []);

  if (loading) {
    return <Typography>Yükleniyor...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Öğrenci Listesi</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {students.map((student) => (
          <Box key={student.id} sx={{
            width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {student.firstName} {student.lastName}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {student.email}
                </Typography>
                {student.phone && (
                  <Typography variant="body2">
                    Telefon: {student.phone}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default StudentsListPage;
