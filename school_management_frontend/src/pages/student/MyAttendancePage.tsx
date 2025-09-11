
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { getMyAttendance, type AttendanceDto } from '../../services/attendanceService';

const columns: GridColDef[] = [
  { field: 'className', headerName: 'Ders Adı', width: 250 },
  {
    field: 'date',
    headerName: 'Tarih',
    width: 180,
    valueFormatter: (params: { value: string }) => new Date(params.value).toLocaleDateString('tr-TR'),
  },
  {
    field: 'isPresent',
    headerName: 'Durum',
    width: 120,
    renderCell: (params) => (
      <Typography color={params.value ? 'green' : 'red'}>
        {params.value ? 'Geldi' : 'Gelmedi'}
      </Typography>
    ),
  },
];

function MyAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const data = await getMyAttendance();
        setAttendance(data);
      } catch (error) {
        console.error("Devamsızlık bilgileri yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Devamsızlık Durumu</Typography>
      <DataGrid
        rows={attendance}
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

export default MyAttendancePage;
