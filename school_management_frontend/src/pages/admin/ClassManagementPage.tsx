
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, TextField, Paper, Select, MenuItem, OutlinedInput, Checkbox, ListItemText, type SelectChangeEvent } from '@mui/material';
import { DataGrid, type GridColDef, type GridRowId, type GridRenderCellParams } from '@mui/x-data-grid';
import { getAllClasses, createClass, deleteClass, type ClassDto } from '../../services/classService';
import { getAllTeachers, type TeacherDto } from '../../services/teacherService';

const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 };

function ClassManagementPage() {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [classData, teacherData] = await Promise.all([getAllClasses(), getAllTeachers()]);
      setClasses(classData);
      setTeachers(teacherData);
    } catch (error) {
      console.error("Veriler yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewClassName('');
    setSelectedTeacherIds([]);
  };

  const handleDelete = async (id: GridRowId) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteClass(Number(id));
        fetchAllData();
      } catch (error) { console.error('Ders silinirken hata:', error); }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClass({ className: newClassName, teacherIds: selectedTeacherIds });
      fetchAllData();
      handleClose();
    } catch (error) { console.error('Ders oluşturulurken hata:', error); }
  };

  const handleTeacherSelectChange = (event: SelectChangeEvent<typeof selectedTeacherIds>) => {
    const { target: { value } } = event;
    setSelectedTeacherIds(typeof value === 'string' ? value.split(',').map(Number) : value.map(Number));
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'className', headerName: 'Ders Adı', flex: 1 },
    { field: 'studentCount', headerName: 'Öğrenci Sayısı', width: 150, valueGetter: (params: GridRenderCellParams<ClassDto>) => params.row.students.length },
    { field: 'teacherCount', headerName: 'Öğretmen Sayısı', width: 150, valueGetter: (params: GridRenderCellParams<ClassDto>) => params.row.teachers.length },
    {
      field: 'actions', headerName: 'İşlemler', width: 150, sortable: false,
      renderCell: (params) => <Button size="small" color="error" onClick={() => handleDelete(params.id)}>Sil</Button>,
    },
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Ders Yönetimi</Typography>
        <Button variant="contained" onClick={handleOpen}>Yeni Ders Ekle</Button>
      </Box>
      <DataGrid rows={classes} columns={columns} loading={loading} />
      <Modal open={open} onClose={handleClose}>
        <Paper sx={modalStyle}>
          <Typography variant="h6">Yeni Ders Oluştur</Typography>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
            <TextField label="Ders Adı" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} fullWidth required sx={{ mb: 2 }}/>
            <Select
              multiple
              fullWidth
              value={selectedTeacherIds}
              onChange={handleTeacherSelectChange}
              input={<OutlinedInput label="Öğretmenler" />}
              renderValue={(selected) => teachers.filter(t => selected.includes(t.id)).map(t => `${t.firstName} ${t.lastName}`).join(', ' )}
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  <Checkbox checked={selectedTeacherIds.indexOf(teacher.id) > -1} />
                  <ListItemText primary={`${teacher.firstName} ${teacher.lastName}`} />
                </MenuItem>
              ))}
            </Select>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>İptal</Button>
              <Button type="submit" variant="contained">Oluştur</Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default ClassManagementPage;
