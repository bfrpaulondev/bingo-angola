import { useState, useMemo, useEffect } from 'react';
import { Outlet, NavLink as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useLang } from '@/contexts/LanguageContext';

// Exemplo: considere admin se token === 'admin' (troque pela tua lógica real)
function isAdmin() {
  return localStorage.getItem('token') === 'admin';
}

const labels = {
  pt: { login: 'Login', tracking: 'Rastreio', contact: 'Contato', policy: 'Políticas', admin: 'Admin' },
  en: { login: 'Login', tracking: 'Tracking', contact: 'Contact', policy: 'Policies', admin: 'Admin' },
};

export default function Layout() {
  const { lang, toggleLang } = useLang();
  const L = labels[lang];
  const systemTheme = useTheme();
  const isSmDown = useMediaQuery(systemTheme.breakpoints.down('sm'));

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('dark');
    return stored ? JSON.parse(stored) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('dark', JSON.stringify(darkMode));
  }, [darkMode]);

  const dynamicTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: '#007b80' },
          secondary: { main: '#ff9d00' },
          background: {
            default: darkMode ? '#121212' : '#ffffe0',
            paper: darkMode ? '#1e1e1e' : '#e0ffff',
          },
        },
        shape: { borderRadius: 12 },
      }),
    [darkMode]
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  // Gera os itens normais + admin só se for admin
  const navItems = useMemo(
    () => [
      { to: '/',         label: L.login     },
      { to: '/tracking', label: L.tracking  },
      { to: '/contact',  label: L.contact   },
      { to: '/policy',   label: L.policy    },
      ...(isAdmin() ? [{ to: '/admin', label: L.admin }] : []),
    ],
    [L]
  );

  const navStyle = ({ isActive }) => ({
    color: isActive ? '#ffffff' : '#e0ffff',
    backgroundColor: isActive ? '#007b80' : 'transparent',
    m: 0.5,
  });

  return (
    <ThemeProvider theme={dynamicTheme}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Box sx={{ flexGrow: 1 }} />

          <IconButton color="inherit" onClick={toggleLang} sx={{ mr: 0.5 }}>
            <LanguageIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => setDarkMode(d => !d)} sx={{ mr: 1 }}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {isSmDown ? (
            <>
              <IconButton color="inherit" onClick={openMenu}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                {navItems.map(({ to, label }) => (
                  <MenuItem
                    key={to}
                    component={RouterLink}
                    to={to}
                    onClick={closeMenu}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            navItems.map(({ to, label }) => (
              <Button key={to} component={RouterLink} to={to} sx={navStyle}>
                {label}
              </Button>
            ))
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 2, minHeight: '80vh', minWidth: '80vw' }}>
        <Outlet />
      </Container>

      <Box textAlign="center" pb={2} fontSize="0.875rem">
        © {new Date().getFullYear()} Bingo Angola — Desenvolvido por{' '}
        <a href="https://www.linkedin.com/in/bfrpaulondev/">Bruno Paulon</a>
      </Box>
    </ThemeProvider>
  );
}
