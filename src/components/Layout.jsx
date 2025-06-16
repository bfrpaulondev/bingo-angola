/*  src/components/Layout.jsx  */
import { useState, useMemo } from 'react';
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
import { useLang } from '@/contexts/LanguageContext';

/* rótulos em PT / EN */
const labels = {
  pt: { login: 'Login', tracking: 'Rastreio', contact: 'Contato', policy: 'Políticas' },
  en: { login: 'Login', tracking: 'Tracking', contact: 'Contact', policy: 'Policies' },
};

export default function Layout() {
  const { lang, toggleLang } = useLang();
  const L = labels[lang];

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const navItems = useMemo(
    () => [
      { to: '/',         label: L.login     },
      { to: '/tracking', label: L.tracking  },
      { to: '/contact',  label: L.contact   },
      { to: '/policy',   label: L.policy    },
    ],
    [L]
  );

  const navStyle = ({ isActive }) => ({
    color: isActive ? '#ffffff' : '#e0ffff',
    backgroundColor: isActive ? '#007b80' : 'transparent',
    m: 0.5,
  });

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          {/* espaçador para empurrar botões à direita */}
          <Box sx={{ flexGrow: 1 }} />

          {/* seletor global de idioma */}
          <IconButton color="inherit" onClick={toggleLang}>
            <LanguageIcon />
          </IconButton>

          {/* navegação responsiva */}
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
    </>
  );
}
