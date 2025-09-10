
import api from './api';

// Backend DTO'larına uygun tipleri tanımlayalım
export interface TeacherDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CreateTeacherDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Şifre oluşturma ve güncelleme için
  phone?: string;
}

// Öğretmenleri getiren fonksiyon
export const getAllTeachers = async (): Promise<TeacherDto[]> => {
  const response = await api.get('/teachers');
  return response.data;
};

// Yeni öğretmen oluşturan fonksiyon
export const createTeacher = async (teacherData: CreateTeacherDto): Promise<TeacherDto> => {
  const response = await api.post('/teachers', teacherData);
  return response.data;
};

// Öğretmen güncelleyen fonksiyon
export const updateTeacher = async (id: number, teacherData: CreateTeacherDto): Promise<TeacherDto> => {
  const response = await api.put(`/teachers/${id}`, teacherData);
  return response.data;
};

// Öğretmen silen fonksiyon
export const deleteTeacher = async (id: number): Promise<void> => {
  await api.delete(`/teachers/${id}`);
};
