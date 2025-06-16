import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Paper, Typography, Stack, List, ListItem, ListItemText, Alert } from '@mui/material';

export default function Tracking() {
  const [code, setCode] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await axios.get(`/api/tracking/${code}`);
      setData(res.data);
    } catch {
      setError('Código não encontrado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField label="Código" value={code} onChange={e => setCode(e.target.value)} fullWidth />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Buscando…' : 'Rastrear'}
          </Button>
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      {data && (
        <List>
          {data.history.map(item => (
            <ListItem key={item.date} divider>
              <ListItemText primary={item.status} secondary={item.date} />
            </ListItem>
          ))}
        </List>
      )}
    </Stack>
  );
}
