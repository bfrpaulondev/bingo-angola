import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Link,
  useMediaQuery,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@/contexts/LanguageContext';

const messages = {
  pt: {
    title: 'Bem-vindo(a)!',
    subtitle: 'Entre com sua conta para continuar',
    email: 'E-mail',
    password: 'Senha',
    remember: 'Lembrar-me',
    forgot: 'Esqueceu a senha?',
    login: 'Acessar',
    loading: 'Autenticando…',
    forgotTitle: 'Recuperar senha',
    forgotDesc: 'Enviaremos um link de redefinição para o e-mail informado.',
    send: 'Enviar',
    cancel: 'Cancelar',
    successMail: 'E-mail de recuperação enviado! Verifique sua caixa.',
    errors: {
      email: 'Informe um e-mail válido',
      password: 'Mínimo 4 caracteres',
      forgotEmail: 'E-mail obrigatório',
    },
  },
  en: {
    title: 'Welcome!',
    subtitle: 'Sign in to continue',
    email: 'Email',
    password: 'Password',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    login: 'Login',
    loading: 'Signing in…',
    forgotTitle: 'Password recovery',
    forgotDesc: 'We will send a reset link to your email.',
    send: 'Send',
    cancel: 'Cancel',
    successMail: 'Recovery e-mail sent! Check your inbox.',
    errors: {
      email: 'Enter a valid e-mail',
      password: 'Min 4 characters',
      forgotEmail: 'E-mail required',
    },
  },
};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function LoginPage() {
  const { lang, toggleLang } = useLang();
  const theme = useTheme();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('dark');
    return stored ? JSON.parse(stored) : prefersDark;
  });

  const [showPwd, setShowPwd] = useState(false);
  const toggleShowPwd = () => setShowPwd(s => !s);

  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

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

  const t = key => messages[lang][key];

  const schema = useMemo(
    () =>
      yup.object({
        email: yup.string().email(t('errors').email).required(t('errors').email),
        password: yup.string().min(4, t('errors').password).required(t('errors').password),
      }),
    [lang]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgot,
  } = useForm({
    resolver: yupResolver(
      yup.object({
        email: yup.string().email(t('errors').forgotEmail).required(t('errors').forgotEmail),
      })
    ),
  });

  const navigate = useNavigate();

  const onSubmit = async data => {
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL || 'https://api.meuprojeto.com';
      const res = await axios.post(`${API}/auth/login`, data);
      localStorage.setItem('token', res.data.token);
      navigate('/tracking');
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Erro', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const sendForgot = async data => {
    try {
      const API = import.meta.env.VITE_API_URL || 'https://api.meuprojeto.com';
      await axios.post(`${API}/auth/forgot`, data);
      setSnack({ open: true, msg: t('successMail'), severity: 'success' });
      setForgotOpen(false);
      resetForgot();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Erro', severity: 'error' });
    }
  };

  useEffect(() => localStorage.setItem('dark', JSON.stringify(darkMode)), [darkMode]);

  const heroVar = { initial: { opacity: 0, y: -30 }, enter: { opacity: 1, y: 0, transition: { duration: 0.8 } } };
  const formVar = { initial: { opacity: 0, y: 30 }, enter: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

  return (
    <ThemeProvider theme={dynamicTheme}>
      <Grid container direction="column" alignItems="center" justifyContent="flex-start" sx={{ minHeight: '100vh', px: 2 }}>
        <Grid item xs={12} component={motion.div} variants={heroVar} initial="initial" animate="enter">
  <Box
    sx={{
      width: '100%',
      minWidth: 280,
      height: 300,
      mx: 'auto',
      mt: 4,
      borderRadius: 4,
      background: darkMode
        ? 'linear-gradient(90deg, #00393c 0%, #001818 100%)'
        : 'linear-gradient(90deg, #a0fff4 0%, #ffffe0 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}
  >
    <Stack spacing={2} alignItems="center" textAlign="center" px={4} >
      <Typography variant="h3" color="secondary" fontWeight={700}>
        {lang === 'pt' ? 'Bingo Transportadora' : 'Bingo Carrier'}
      </Typography>
      <Typography variant="h6" maxWidth={600}>
        {lang === 'pt'
          ? 'Rastreamento de encomendas descomplicado, rápido e seguro.'
          : 'Package tracking made simple, fast and secure.'}
      </Typography>
    </Stack>
    <Box sx={{ position: 'absolute', width: '100%',
      height: 300,
      mx: 'auto',
       borderRadius: '50%', background: '#ff9d0060',  filter: 'blur(40px)' }} />
  </Box>
</Grid>

        <Grid item xs={12} component={motion.div} variants={formVar} initial="initial" animate="enter" sx={{ width: '100%', maxWidth: 420, mt: 4 }}>
          <Paper elevation={6} sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <IconButton onClick={toggleLang}><LanguageIcon /></IconButton>
              <IconButton onClick={() => setDarkMode(d => !d)}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField label={t('email')} fullWidth margin="normal" {...register('email')} error={!!errors.email} helperText={errors.email?.message} autoComplete="email" />
              <TextField
                label={t('password')}
                type={showPwd ? 'text' : 'password'}
                fullWidth
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowPwd} edge="end">
                        {showPwd ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <FormControlLabel control={<Checkbox color="primary" defaultChecked />} label={t('remember')} />
                <Link component="button" onClick={() => setForgotOpen(true)} alignSelf="flex-end">{t('forgot')}</Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? t('loading') : t('login')}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Dialog open={forgotOpen} TransitionComponent={Transition} keepMounted onClose={() => setForgotOpen(false)}>
          <DialogTitle>{t('forgotTitle')}</DialogTitle>
          <DialogContent dividers>
            <Typography mb={2}>{t('forgotDesc')}</Typography>
            <TextField label={t('email')} fullWidth {...registerForgot('email')} error={!!forgotErrors.email} helperText={forgotErrors.email?.message} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setForgotOpen(false)}>{t('cancel')}</Button>
            <Button onClick={handleForgotSubmit(sendForgot)} variant="contained" color="primary">
              {t('send')}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snack.open} autoHideDuration={6000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))} variant="filled">
            {snack.msg}
          </Alert>
        </Snackbar>
      </Grid>
    </ThemeProvider>
  );
}
