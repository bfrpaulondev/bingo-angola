import React, { useState, useEffect } from 'react';
import {
  Stack, Paper, TextField, Button, Typography, Box,
  LinearProgress, CircularProgress, Alert, IconButton,
  List, ListItem, ListItemAvatar, ListItemText, Chip,
  Tooltip, Skeleton, useMediaQuery, Fade
} from '@mui/material';
import {
  Search as SearchIcon,
  AirplanemodeActive as PlaneIcon,
  LocalShipping as TruckIcon,
  Home as HomeIcon,
  ContactSupport as ContactIcon,
  TrackChanges as TrackIcon,
  AssignmentTurnedIn as DeliveredIcon,
  Timelapse as PendingIcon,
  ArrowForward as ArrowIcon,
  Replay as ReloadIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useLang } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const USE_MOCK = true;

const MOCK_DATA = [
  {
    code: "BR123456789PT",
    status: "delivered",
    recipient: "João Silva",
    history: [
      { status: "pending", date: "2025-06-11T10:21:00Z" },
      { status: "transit", date: "2025-06-12T16:04:00Z" },
      { status: "delivered", date: "2025-06-13T08:41:00Z" }
    ]
  },
  {
    code: "BR987654321PT",
    status: "contact",
    recipient: "Amanda Costa",
    history: [
      { status: "pending", date: "2025-06-10T09:09:00Z" },
      { status: "transit", date: "2025-06-11T17:35:00Z" },
      { status: "contact", date: "2025-06-13T19:42:00Z" }
    ]
  }
];

const TRACKING_STATUSES = [
  { key: 'pending', label: { pt: 'Aguardando envio', en: 'Awaiting shipment' }, icon: <PendingIcon />, color: 'warning' },
  { key: 'transit', label: { pt: 'Em trânsito', en: 'In transit' }, icon: <PlaneIcon />, color: 'info' },
  { key: 'delivered', label: { pt: 'Entregue', en: 'Delivered' }, icon: <DeliveredIcon />, color: 'success' },
  { key: 'contact', label: { pt: 'Entre em contacto', en: 'Contact support' }, icon: <ContactIcon />, color: 'error' },
];

const messages = {
  pt: {
    title: 'Rastreio de Encomendas',
    search: 'Pesquisar pelo código de rastreio',
    placeholder: 'Digite o código...',
    button: 'Rastrear',
    loading: 'Buscando…',
    error: 'Código não encontrado.',
    noAuth: 'Faça login para ver todas as suas encomendas.',
    myShipments: 'Minhas Encomendas',
    status: 'Status',
    updated: 'Última atualização',
    object: 'Objeto',
    progress: 'Progresso',
    recipient: 'Destinatário',
    searchLabel: 'Pesquisar outro código',
    reload: 'Recarregar',
    timeline: 'Histórico de Movimentação',
    nothingFound: 'Nenhum resultado encontrado.',
    delivered: 'Entregue',
    transit: 'Em trânsito',
    pending: 'Aguardando envio',
    contact: 'Entre em contacto',
  },
  en: {
    title: 'Order Tracking',
    search: 'Search by tracking code',
    placeholder: 'Enter code...',
    button: 'Track',
    loading: 'Searching…',
    error: 'Code not found.',
    noAuth: 'Login to see all your shipments.',
    myShipments: 'My Shipments',
    status: 'Status',
    updated: 'Last update',
    object: 'Object',
    progress: 'Progress',
    recipient: 'Recipient',
    searchLabel: 'Search another code',
    reload: 'Reload',
    timeline: 'Tracking History',
    nothingFound: 'No results found.',
    delivered: 'Delivered',
    transit: 'In transit',
    pending: 'Awaiting shipment',
    contact: 'Contact support',
  },
};

const getStatusData = (status, lang = 'pt') => {
  const found = TRACKING_STATUSES.find((s) => s.key === status);
  return found
    ? { label: found.label[lang], icon: found.icon, color: found.color }
    : { label: status, icon: <TrackIcon />, color: 'info' };
};

function ProgressBar({ status }) {
  const progress = status === 'pending' ? 25 : status === 'transit' ? 60 : status === 'delivered' ? 100 : 100;
  const theme = useTheme();
  const color =
    status === 'pending'
      ? theme.palette.warning.main
      : status === 'transit'
      ? theme.palette.info.main
      : status === 'delivered'
      ? theme.palette.success.main
      : theme.palette.error.main;
  return (
    <Box mt={2} mb={2} sx={{ width: '100%'  }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 18,
          borderRadius: 8,
          background: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200],
          '& .MuiLinearProgress-bar': { background: color },
        }}
        color="inherit"
      />
    </Box>
  );
}

function Timeline({ history, lang, size }) {
  const fontSize = size === 'lg' ? 18 : size === 'md' ? 16 : 14;
  return (
    <List sx={{ width: '100%', maxWidth: size === 'lg' ? 750 : size === 'md' ? 600 : 320, mx: 'auto', mt: 2, mb: 2 }}>
      {history.length === 0 && (
        <ListItem>
          <ListItemText primary={messages[lang].nothingFound} />
        </ListItem>
      )}
      {history.map((item, idx) => (
        <Fade in key={item.date}>
          <ListItem divider alignItems="flex-start" sx={{ py: 2 }}>
            <ListItemAvatar>
              <Box sx={{ fontSize: fontSize + 10 }}>{getStatusData(item.status, lang).icon}</Box>
            </ListItemAvatar>
            <ListItemText
              primary={
                <span style={{ fontSize, fontWeight: idx === 0 ? 700 : 500 }}>
                  {getStatusData(item.status, lang).label}
                </span>
              }
              secondary={
                <span style={{ fontSize: fontSize - 2, color: '#888' }}>
                  {new Date(item.date).toLocaleString(lang === 'pt' ? 'pt-PT' : 'en-US')}
                </span>
              }
            />
            {idx === 0 && (
              <Chip label={messages[lang].updated} size="small" color="primary" />
            )}
          </ListItem>
        </Fade>
      ))}
    </List>
  );
}

function TrackingCard({ object, lang, reload, size }) {
  const theme = useTheme();
  const statusData = getStatusData(object.status, lang);
  const cardBg = theme.palette.mode === 'dark' ? theme.palette.grey[900] : '#fafbfd';
  const textColor = theme.palette.mode === 'dark' ? theme.palette.grey[50] : theme.palette.grey[900];
  const headerSize = size === 'lg' ? 'h4' : size === 'md' ? 'h5' : 'h6';
  return (
    <Paper elevation={5}
      sx={{
        p: size === 'lg' ? 5 : size === 'md' ? 4 : 2.5,
        mb: 4,
        borderRadius: 6,
        maxWidth: size === 'lg' ? 850 : size === 'md' ? 650 : 340,
        mx: 'auto',
        background: cardBg,
        color: textColor,
        boxShadow: theme.palette.mode === 'dark' ? 16 : 8,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mb={1}>
        <Typography variant={headerSize} color="primary" fontWeight={700}>
          {messages[lang].object}: {object.code}
        </Typography>
        <Tooltip title={messages[lang].reload}>
          <IconButton size="small" onClick={reload} sx={{ color: textColor }}>
            <ReloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Stack direction="column" alignItems="center" spacing={2} mb={2}>
        <Chip
          icon={statusData.icon}
          label={statusData.label}
          color={statusData.color}
          sx={{ fontWeight: 700, minWidth: 140, fontSize: 18, height: 38 }}
        />
        <ProgressBar status={object.status} />
      </Stack>
      <Typography variant="body1" sx={{ mb: 2, color: textColor }}>
        {messages[lang].recipient}: <strong>{object.recipient || '---'}</strong>
      </Typography>
      <Timeline history={object.history || []} lang={lang} size={size} />
    </Paper>
  );
}

export default function TrackingPage() {
  const { lang } = useLang();
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [all, setAll] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  // Responsividade real
  const isSmall = useMediaQuery('(max-width:600px)');
  const isMedium = useMediaQuery('(min-width:601px) and (max-width:1100px)');
  const isLarge = useMediaQuery('(min-width:1101px)');

  const size = isLarge ? 'lg' : isMedium ? 'md' : 'sm';

  const logged = !!localStorage.getItem('token');

  useEffect(() => {
    if (logged) {
      setLoading(true);
      if (USE_MOCK) {
        setTimeout(() => {
          setAll(MOCK_DATA);
          setLoading(false);
        }, 800);
      } else {
        axios
          .get('/api/my-trackings')
          .then((res) => setAll(res.data))
          .catch(() => setAll([]))
          .finally(() => setLoading(false));
      }
    }
  }, [logged]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');
    setLoading(true);
    if (USE_MOCK) {
      setTimeout(() => {
        const obj = MOCK_DATA.find(obj => obj.code === code);
        if (obj) {
          setResult(obj);
        } else {
          setError(messages[lang].error);
          setResult(null);
        }
        setLoading(false);
      }, 700);
    } else {
      try {
        const res = await axios.get(`/api/tracking/${code}`);
        setResult(res.data);
      } catch {
        setError(messages[lang].error);
        setResult(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const reload = () => {
    if (code) handleSearch({ preventDefault: () => {} });
  };

  // Definições de responsividade para Paper principal
  const paperWidth =
    size === 'lg' ? 850
      : size === 'md' ? 600
        : '98vw';

  const paperPadding =
    size === 'lg' ? 5
      : size === 'md' ? 4
        : 2;

  return (
    <Stack spacing={4} alignItems="center" justifyContent="flex-start" sx={{ width: '100%', minHeight: '90vh', pt: 4 }}>
      <Paper
        elevation={7}
        sx={{
          width: paperWidth,
          maxWidth: '100vw',
          p: paperPadding,
          mb: 1,
          borderRadius: 4,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #19262e 0%, #222f38 100%)'
            : 'linear-gradient(180deg, #e0ffff 0%, #fafbfd 100%)'
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <TrackIcon color="primary" sx={{ fontSize: size === 'lg' ? 48 : size === 'md' ? 38 : 30 }} />
          <Typography variant={size === 'lg' ? 'h3' : size === 'md' ? 'h4' : 'h5'} color="primary" fontWeight={800}>
            {messages[lang].title}
          </Typography>
        </Box>

        {!logged && (
          <>
            <Typography variant="subtitle1" mb={2}>
              {messages[lang].search}
            </Typography>
            <Box component="form" onSubmit={handleSearch}>
              <Stack direction={isSmall ? 'column' : 'row'} spacing={2} mt={1} mb={3}> 
                <TextField
                  fullWidth
                  label={messages[lang].placeholder}
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: <SearchIcon />,
                  }}
                  sx={{
                    input: {
                      color: theme.palette.mode === 'dark' ? '#e0ffff' : '#111',
                      fontSize: size === 'lg' ? 20 : size === 'md' ? 17 : 15
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size={size === 'lg' ? 'large' : 'medium'}
                  disabled={loading || !code}
                  endIcon={loading ? <CircularProgress size={22} color="inherit" /> : <ArrowIcon />}
                  sx={{
                    minWidth: 120, fontWeight: 700,
                    fontSize: size === 'lg' ? 19 : size === 'md' ? 16 : 15
                  }}
                >
                  {loading ? messages[lang].loading : messages[lang].button}
                </Button>
              </Stack>
            </Box>
            {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
            {result && (
              <Fade in>
                <Box>
                  <TrackingCard object={result} lang={lang} reload={reload} size={size} />
                </Box>
              </Fade>
            )}
          </>
        )}

        {logged && (
          <>
            <Typography variant="subtitle1" mb={3} sx={{ color: theme.palette.text.primary }}>
              {messages[lang].myShipments}
            </Typography>
            {loading && (
              <Stack spacing={2} sx={{ mt: 2 }}>
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} height={120} width="100%" animation="wave" variant="rounded" />
                ))}
              </Stack>
            )}
            {!loading && all.length === 0 && (
              <Alert severity="info">{messages[lang].nothingFound}</Alert>
            )}
            <Stack spacing={3}>
              {all.map((object) => (
                <TrackingCard key={object.code} object={object} lang={lang} reload={() => {}} size={size} />
              ))}
            </Stack>
          </>
        )}
      </Paper>
      <Box sx={{ mt: 6 }}>
        <Fade in>
          <Box display="flex" alignItems="center" gap={2} sx={{ opacity: 0.5 }}>
            <PlaneIcon fontSize={size === 'lg' ? 'large' : size === 'md' ? 'medium' : 'small'} />
            <TruckIcon fontSize={size === 'lg' ? 'large' : size === 'md' ? 'medium' : 'small'} />
            <HomeIcon fontSize={size === 'lg' ? 'large' : size === 'md' ? 'medium' : 'small'} />
          </Box>
        </Fade>
      </Box>
    </Stack>
  );
}
