
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import type { ReactNode } from 'react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Üst boşluk için bir ayar eklenebilir, örn: Toolbar */}
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
