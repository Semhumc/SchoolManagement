import api from './api';

export interface CommentDto {
    id: number;
    studentName: string;
    teacherName: string;
    className: string;
    commentText: string;
    createdAt: string;
}

export interface CreateCommentDto {
    studentId: number;
    classId: number;
    commentText: string;
}

// Giriş yapmış öğrencinin kendi yorumlarını getiren fonksiyon
export const getMyComments = async (): Promise<CommentDto[]> => {
    const response = await api.get('/comments/my');
    return response.data;
};

// Öğretmenin yorum eklemesi
export const addComment = async (data: CreateCommentDto): Promise<CommentDto> => {
    const response = await api.post('/comments', data);
    return response.data;
};