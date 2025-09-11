import api from './api';

// Backend DTO'larına uygun tipleri tanımlayalım
export interface StudentDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Şifre oluşturma ve güncelleme için
  phone?: string;
}

// Öğrencileri getiren fonksiyon
export const getAllStudents = async (): Promise<StudentDto[]> => {
  const response = await api.get('/students');
  return response.data;
};

// ID ile tek bir öğrenci getiren fonksiyon
export const getStudentById = async (id: number): Promise<StudentDto> => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

// Yeni öğrenci oluşturan fonksiyon
export const createStudent = async (studentData: CreateStudentDto): Promise<StudentDto> => {
  const response = await api.post('/students', studentData);
  return response.data;
};

// Öğrenci güncelleyen fonksiyon
export const updateStudent = async (id: number, studentData: CreateStudentDto): Promise<StudentDto> => {
  const response = await api.put(`/students/${id}`, studentData);
  return response.data;
};

// Öğrenci silen fonksiyon
export const deleteStudent = async (id: number): Promise<void> => {
  await api.delete(`/students/${id}`);
};

export const getStudentsByClassId = async (classId: number): Promise<StudentDto[]> => {
  const response = await api.get(`/students/by-class/${classId}`);
  return response.data;
};