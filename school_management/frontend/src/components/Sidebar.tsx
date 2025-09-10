
import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Divider } from '@mui/material';
import { People, School, Class, BarChart, Comment, Home, Logout } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

interface MenuItems {
  Admin: MenuItem[];
  Teacher: MenuItem[];
  Student: MenuItem[];
}

const menuItems: MenuItems = {
  Admin: [
    { text: 'Anasayfa', icon: <Home />, path: '/' },
    { text: 'Öğrenciler', icon: <People />, path: '/students' },
    { text: 'Öğretmenler', icon: <School />, path: '/teachers' },
    { text: 'Dersler', icon: <Class />, path: '/classes' },
  ],
  Teacher: [
    { text: 'Anasayfa', icon: <Home />, path: '/' },
    { text: 'Derslerim', icon: <Class />, path: '/my-classes' },
    { text: 'Öğrenciler', icon: <People />, path: '/students' },
  ],
  Student: [
    { text: 'Anasayfa', icon: <Home />, path: '/' },
    { text: 'Ders Programım', icon: <Class />, path: '/my-schedule' },
    { text: 'Notlarım', icon: <BarChart />, path: '/my-scores' },
    { text: 'Devamsızlık', icon: <Comment />, path: '/my-attendance' },
    { text: 'Yorumlarım', icon: <Comment />, path: '/my-comments' },
  ],
};

function Sidebar() {
  const { user, logout } = useAuth();
  const items = user ? menuItems[user.role as keyof MenuItems] || [] : [];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <List sx={{ flexGrow: 1 }}>
          {items.map((item: MenuItem) => (
            <ListItem key={item.text} disablePadding component={Link} to={item.path} sx={{ color: 'inherit', textDecoration: 'none' }}>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={logout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Çıkış Yap" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
