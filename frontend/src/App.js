import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Home from './pages/Home';
import Priority from './pages/Priority';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
    primary: {
      main: '#4f46e5', // Indigo
    },
    secondary: {
      main: '#ec4899', // Pink
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", sans-serif',
    h4: { fontWeight: 800, color: '#1e293b' },
    h6: { fontWeight: 600, color: '#334155' },
    subtitle1: { color: '#64748b' }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '6px 16px',
        },
      },
    },
  },
});

function Navigation() {
  const location = useLocation();
  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      background: 'linear-gradient(90deg, #4f46e5 0%, #3b82f6 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <NotificationsActiveIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#fff', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Affordmed Notify
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              component={Link} 
              to="/" 
              sx={{ 
                color: 'white', 
                backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Dashboard
            </Button>
            <Button 
              component={Link} 
              to="/priority" 
              sx={{ 
                color: 'white', 
                backgroundColor: location.pathname === '/priority' ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Priority Inbox
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/priority" element={<Priority />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
