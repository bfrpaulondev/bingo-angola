import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary:   { main: '#007b80' },   // cor-2
    secondary: { main: '#ff9d00' },   // cor-3
    background: {
      default: '#ffffe0',             // cor-5
      paper:   '#e0ffff',             // cor-4
    },
    text: {
      primary: '#007b80',
      secondary: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: 'none', fontWeight: 600 },
      },
    },
  },
});
