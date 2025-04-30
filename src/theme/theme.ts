import { createTheme } from '@mui/material/styles';

// Thème par défaut (bleu)
export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#0000FF',
    },
    secondary: {
      main: '#19857b',
    },
  },
});

// Thème pour les propriétaires (orange)
export const ownerTheme = createTheme({
  palette: {
    primary: {
      main: '#F17D00',
    },
    secondary: {
      main: '#19857b',
    },
  },
});

// Fonction pour obtenir le thème en fonction du rôle de l'utilisateur
export const getThemeByRole = (role?: string) => {
  if (role === 'owner') {
    return ownerTheme;
  }
  return defaultTheme;
};
