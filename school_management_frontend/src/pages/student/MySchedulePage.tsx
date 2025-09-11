
import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { getMyScores } from '../../services/scoreService';
import { getMyAttendance } from '../../services/attendanceService';

function MySchedulePage() {
  const [classNames, setClassNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        // Hem notları hem devamsızlıkları çek
        const scores = await getMyScores();
        const attendance = await getMyAttendance();

        // İki listeden de ders isimlerini topla
        const scoresClasses = scores.map(s => s.className);
        const attendanceClasses = attendance.map(a => a.className);

        // Tekrarsız bir ders listesi oluştur (Set kullanarak)
        const uniqueClassNames = [...new Set([...scoresClasses, ...attendanceClasses])];
        
        setClassNames(uniqueClassNames);
      } catch (error) {
        console.error("Ders programı yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return <Typography>Yükleniyor...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Ders Programım</Typography>
      <Paper>
        <List>
          {classNames.length > 0 ? (
            classNames.map((name, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={name} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Kayıtlı olduğunuz bir ders bulunamadı." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default MySchedulePage;
