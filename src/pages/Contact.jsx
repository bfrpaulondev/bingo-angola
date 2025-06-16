import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Stack,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  Box,
  Slide,
} from '@mui/material';
import {
  Send as SendIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useLang } from '@/contexts/LanguageContext';

const messages = {
  pt: {
    title: 'Fale Conosco',
    name: 'Nome',
    email: 'E-mail',
    message: 'Mensagem',
    send: 'Enviar',
    sending: 'Enviando…',
    success: 'Mensagem enviada com sucesso!',
    error: 'Erro ao enviar a mensagem. Tente novamente.',
    errors: {
      name: 'Informe seu nome',
      email: 'Informe um e-mail válido',
      message: 'Escreva sua mensagem',
    },
  },
  en: {
    title: 'Contact Us',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send',
    sending: 'Sending…',
    success: 'Message sent successfully!',
    error: 'Error sending message. Please try again.',
    errors: {
      name: 'Enter your name',
      email: 'Enter a valid email',
      message: 'Write your message',
    },
  },
};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ContactPage() {
  const { lang, toggleLang } = useLang();
  const t = key => messages[lang][key];
  const theme = useTheme();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const isSmall = useMediaQuery('(max-width:600px)');
  const isMedium = useMediaQuery('(min-width:601px) and (max-width:900px)');
  const formMaxWidth = isSmall ? 280 : isMedium ? 500 : 600;

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('dark');
    return stored ? JSON.parse(stored) : prefersDark;
  });

  const dynamicTheme = useMemo(
    () => createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: { main: '#007b80' },
        secondary: { main: '#ff9d00' },
        background: { default: darkMode ? '#121212' : '#ffffe0', paper: darkMode ? '#1e1e1e' : '#e0ffff' },
      },
      shape: { borderRadius: 12 },
    }), [darkMode]
  );

  const schema = useMemo(
    () => yup.object({
      name: yup.string().required(messages[lang].errors.name),
      email: yup.string().email(messages[lang].errors.email).required(messages[lang].errors.email),
      message: yup.string().required(messages[lang].errors.message),
    }), [lang]
  );

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const onSubmit = async data => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'https://api.meuprojeto.com'}/contact`, data);
      setSnack({ open: true, msg: t('success'), severity: 'success' });
      reset();
    } catch {
      setSnack({ open: true, msg: t('error'), severity: 'error' });
    }
  };

  useEffect(() => localStorage.setItem('dark', JSON.stringify(darkMode)), [darkMode]);

  const containerVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <ThemeProvider theme={dynamicTheme}>
      <Stack
        component={motion.div}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '80vh', px: 2 }}
      >
        <Stack sx={{ maxWidth: formMaxWidth, width: '100%' }}>
          <Paper elevation={6} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <IconButton onClick={toggleLang}><LanguageIcon /></IconButton>
              <IconButton onClick={() => setDarkMode(d => !d)}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
            <Typography variant={isSmall ? 'h6' : isMedium ? 'h5' : 'h4'} color="primary" gutterBottom>
              {t('title')}
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={2}>
                <TextField
                  label={t('name')}
                  fullWidth
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <TextField
                  label={t('email')}
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  label={t('message')}
                  fullWidth
                  multiline rows={4}
                  {...register('message')}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                  disabled={isSubmitting}
                  sx={{ mt: 1 }}
                >
                  {isSubmitting ? t('sending') : t('send')}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Stack>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
