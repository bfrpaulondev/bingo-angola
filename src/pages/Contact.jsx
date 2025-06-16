import { useForm } from 'react-hook-form';
import { TextField, Button, Paper, Typography, Stack } from '@mui/material';

export default function Contact() {
  const { register, handleSubmit, formState:{ errors } } = useForm();

  function onSubmit(values) {
    alert(`Mensagem enviada!\n\n${JSON.stringify(values, null, 2)}`);
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" mb={2} color="primary">Fale Conosco</Typography>
      <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Nome" {...register('name', { required: true })} error={!!errors.name} />
        <TextField label="E-mail" {...register('email', { required: true })} error={!!errors.email} />
        <TextField
          label="Mensagem"
          multiline rows={4}
          {...register('message', { required: true })}
          error={!!errors.message}
        />
        <Button type="submit" variant="contained" color="secondary">Enviar</Button>
      </Stack>
    </Paper>
  );
}
