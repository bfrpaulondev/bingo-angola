import { Typography, Paper, Stack } from '@mui/material';

export default function Policy() {
  return (
    <Paper elevation={1} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Stack spacing={2}>
        <Typography variant="h4" color="primary">Políticas de Uso</Typography>

        <Typography>
          Esta aplicação destina-se apenas a demonstração de rastreamento…
        </Typography>

        <Typography variant="h6">1. Coleta de Dados</Typography>
        <Typography>
          Não coletamos dados pessoais além do necessário para rastrear encomendas.
        </Typography>

        <Typography variant="h6">2. Cookies</Typography>
        <Typography>
          Usamos cookies estritamente funcionais…
        </Typography>

        <Typography variant="h6">3. Direitos do Usuário</Typography>
        <Typography>
          Você pode solicitar a remoção dos seus dados a qualquer momento.
        </Typography>
      </Stack>
    </Paper>
  );
}
