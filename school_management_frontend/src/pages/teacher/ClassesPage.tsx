import { useEffect, useState } from 'react';
import { getTeacherClasses } from '../services/classService';

interface Class {
    id: string;
    name: string;
    teacherName: string;
}

const ClassesPage = () => {
    const [classes, setClasses] = useState<Class[]>([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await getTeacherClasses();
                setClasses(data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []);

    return (
        <div>
            <h1>My Classes</h1>
            <ul>
                {classes.map(cls => (
                    <li key={cls.id}>{cls.name} - {cls.teacherName}</li>
                ))}
            </ul>
        </div>
    );
};

export default ClassesPage;
