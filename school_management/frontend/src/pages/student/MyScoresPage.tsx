
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { getMyScores, type ScoreDto } from '../../services/scoreService';

const columns: GridColDef[] = [
  { field: 'className', headerName: 'Ders Adı', width: 200 },
  { field: 'value', headerName: 'Not', width: 100 },
  { field: 'teacherName', headerName: 'Öğretmen', width: 200 },
  {
    field: 'createdAt',
    headerName: 'Tarih',
    width: 180,
    valueFormatter: (params: { value: string }) => new Date(params.value).toLocaleDateString('tr-TR'),
  },
];

function MyScoresPage() {
  const [scores, setScores] = useState<ScoreDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        const data = await getMyScores();
        setScores(data);
      } catch (error) {
        console.error("Notlar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Notlarım</Typography>
      <DataGrid
        rows={scores}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
      />
    </Box>
  );
}

export default MyScoresPage;
