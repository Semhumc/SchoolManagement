import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ClassesPage from './pages/teacher/ClassesPage';

import { AuthProvider } from './contexts/AuthContext';

// Modern ve temiz bir tema oluşturalım
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Okul/kurumsal kimliğe uygun bir ana renk
    },
    secondary: {
      main: '#dc004e', // Vurgu rengi
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0'
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/*" element={<Dashboard />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;