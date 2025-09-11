import api from './api';

// Backend DTO'suna uygun Score tipini tanımlayalım
export interface ScoreDto {
  id: number;
  studentName: string;
  teacherName: string;
  className: string;
  value: number;
  createdAt: string; // Tarih string olarak gelecektir
}

export interface CreateScoreDto {
    studentId: number;
    classId: number;
    value: number;
}

// Giriş yapmış öğrencinin notlarını getiren fonksiyon
export const getMyScores = async (): Promise<ScoreDto[]> => {
  const response = await api.get('/scores/my');
  return response.data;
};

// Öğretmenin not eklemesi
export const addScore = async (data: CreateScoreDto): Promise<ScoreDto> => {
    const response = await api.post('/scores', data);
    return response.data;
};