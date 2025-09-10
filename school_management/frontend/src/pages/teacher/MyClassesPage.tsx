
import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import { getMyClasses, type ClassDto } from '../../services/classService';
import { Link } from 'react-router-dom';

function MyClassesPage() {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const data = await getMyClasses();
        setClasses(data);
      } catch (error) {
        console.error("Dersler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return <Typography>Yükleniyor...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Sorumlu Olduğum Dersler</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {classes.map((cls) => (
          <Box key={cls.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{cls.className}</Typography>
                <Typography color="text.secondary">
                  {cls.students.length} Öğrenci
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/classes/${cls.id}/students`} state={{ className: cls.className, studentNames: cls.students }}>Öğrencileri Görüntüle</Button>
                <Button size="small" component={Link} to={`/classes/${cls.id}/attendance`} state={{ className: cls.className, students: cls.students }}>Devamsızlık Al</Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default MyClassesPage;
