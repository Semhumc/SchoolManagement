import api from './api';

export interface ClassDto {
  id: number;
  className: string;
  teachers: string[];
  students: string[];
}

export interface CreateClassDto {
  className: string;
}

// Admin: Tüm dersleri getir
export const getAllClasses = async (): Promise<ClassDto[]> => {
  const response = await api.get('/classes');
  return response.data;
};

// Teacher: Kendi derslerini getir
export const getMyClasses = async (): Promise<ClassDto[]> => {
  const response = await api.get('/classes/my-classes');
  return response.data;
};

// Admin: Yeni ders oluştur
export const createClass = async (classData: CreateClassDto): Promise<ClassDto> => {
  const response = await api.post('/classes', classData);
  return response.data;
};

// Admin: Dersi sil
export const deleteClass = async (id: number): Promise<void> => {
  await api.delete(`/classes/${id}`);
};

// Teacher: Derse öğrenci ekle
export const addStudentToClass = async (classId: number, studentId: number): Promise<void> => {
  await api.post(`/classes/${classId}/students/${studentId}`);
};

// Teacher: Dersten öğrenci çıkar
export const removeStudentFromClass = async (classId: number, studentId: number): Promise<void> => {
  await api.delete(`/classes/${classId}/students/${studentId}`);
};