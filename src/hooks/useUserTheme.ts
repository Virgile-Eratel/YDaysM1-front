import { useState, useEffect } from 'react';
import { getThemeByRole } from '../theme/theme';
import { Theme } from '@mui/material/styles';

export function useUserTheme(): Theme {
  const [theme, setTheme] = useState(getThemeByRole());

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur depuis le localStorage
    const userRole = localStorage.getItem('roleUser');
    
    // Mettre à jour le thème en fonction du rôle
    setTheme(getThemeByRole(userRole || undefined));
    
    // Fonction pour écouter les changements dans le localStorage
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem('roleUser');
      setTheme(getThemeByRole(updatedRole || undefined));
    };
    
    // Ajouter un écouteur d'événements pour les changements dans le localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Nettoyer l'écouteur d'événements lors du démontage du composant
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return theme;
}
