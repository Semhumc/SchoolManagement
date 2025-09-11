
import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode'; // Token'ı decode etmek için bir kütüphane

// Kullanıcı bilgilerinin ve token'ın tipini tanımlayalım
interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean; // Yüklenme durumunu ekle
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT token'dan rolü çıkaran yardımcı fonksiyon
const getRoleFromToken = (token: string): string | null => {
    try {
        const decoded: { 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string } = jwtDecode(token);
        return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } catch (error) {
        console.error("Invalid token specified", error);
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Yüklenme state'i ekle
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      const role = getRoleFromToken(token);
      if(role) {
        setUser({ email, role });
      }
    }
    setLoading(false); // Kontrol bitince yüklenmeyi durdur
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, email: responseEmail, role: responseRole } = response.data;

      if (token && responseRole) {
        localStorage.setItem('token', token);
        localStorage.setItem('email', responseEmail);
        setUser({ email: responseEmail, role: responseRole });
        navigate('/'); // Ana panele yönlendir
      } else {
        throw new Error("Token veya rol bilgisi alınamadı.");
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Hata mesajını kullanıcıya göstermek için burada bir state yönetimi yapılabilir
      throw error; // Hatanın LoginPage'de yakalanmasını sağla
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
