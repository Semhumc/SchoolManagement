import api from './api';

// Backend DTO'suna uygun Attendance tipini tanımlayalım
export interface AttendanceDto {
  id: number;
  studentName: string;
  className: string;
  date: string; // Tarih string olarak gelecektir
  isPresent: boolean;
}

export interface CreateAttendanceDto {
    studentId: number;
    classScheduleId: number; // Bu şimdilik backend'de nasıl yönetildiğine bağlı, 1 varsayabiliriz
    isPresent: boolean;
}

// Giriş yapmış öğrencinin devamsızlık bilgilerini getiren fonksiyon
export const getMyAttendance = async (): Promise<AttendanceDto[]> => {
  const response = await api.get('/attendance/my');
  return response.data;
};

// Tek bir devamsızlık kaydı ekler
export const addAttendance = async (data: CreateAttendanceDto): Promise<AttendanceDto> => {
    const response = await api.post('/attendance', data);
    return response.data;
};