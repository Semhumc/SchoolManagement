import api from './api';

// Backend'deki TimeSpan'a karşılık gelen string formatı
type TimeSpan = string;

export interface ClassScheduleDto {
  id: number;
  classId: number;
  className: string;
  teacherId: number;
  teacherName: string;
  scheduleDate: string; // ISO 8601 formatında tarih stringi
  startTime: TimeSpan;
  endTime: TimeSpan;
  status: string; // Ders durumu eklendi
  location: string;
}

export interface CreateClassScheduleDto {
  classId: number;
  teacherId: number;
  scheduleDate: string; // ISO 8601 formatında tarih stringi
  startTime: TimeSpan;
  endTime: TimeSpan;
  location: string;
}

export const getAllClassSchedules = async (): Promise<ClassScheduleDto[]> => {
  const response = await api.get('/ClassSchedule');
  return response.data;
};

export const getClassScheduleById = async (id: number): Promise<ClassScheduleDto> => {
  const response = await api.get(`/ClassSchedule/${id}`);
  return response.data;
};

export const createClassSchedule = async (scheduleData: CreateClassScheduleDto): Promise<ClassScheduleDto> => {
  const response = await api.post('/ClassSchedule', scheduleData);
  return response.data;
};

export const updateClassSchedule = async (id: number, scheduleData: CreateClassScheduleDto): Promise<void> => {
  await api.put(`/ClassSchedule/${id}`, scheduleData);
};

export const deleteClassSchedule = async (id: number): Promise<void> => {
  await api.delete(`/ClassSchedule/${id}`);
};

export const getMyClassSchedules = async (): Promise<ClassScheduleDto[]> => {
  const response = await api.get('/ClassSchedule/my-schedules');
  return response.data;
};

export const updateClassScheduleStatus = async (scheduleId: number, status: string): Promise<void> => {
  await api.put(`/ClassManagement/${scheduleId}/status`, { status });
};
