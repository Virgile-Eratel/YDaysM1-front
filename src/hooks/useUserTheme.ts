import { useState, useEffect } from 'react';
import { getThemeByRole } from '../theme/theme';
import { Theme } from '@mui/material/styles';

// Créer un événement personnalisé pour notifier les changements de rôle
export const ROLE_CHANGE_EVENT = 'roleUserChange';

// Fonction pour déclencher une mise à jour du thème
export function notifyRoleChange() {
  window.dispatchEvent(new CustomEvent(ROLE_CHANGE_EVENT));
}

export function useUserTheme(): Theme {
  // Récupérer le rôle actuel de l'utilisateur
  const currentRole = localStorage.getItem('roleUser');

  // Initialiser le thème avec le rôle actuel
  const [theme, setTheme] = useState(getThemeByRole(currentRole || undefined));

  useEffect(() => {
    // Fonction pour mettre à jour le thème en fonction du rôle actuel
    const updateTheme = () => {
      const userRole = localStorage.getItem('roleUser');
      setTheme(getThemeByRole(userRole || undefined));
    };

    // Mettre à jour le thème immédiatement
    updateTheme();

    // Écouter les changements dans le localStorage (pour les autres onglets)
    window.addEventListener('storage', updateTheme);

    // Écouter l'événement personnalisé pour les changements de rôle dans le même onglet
    window.addEventListener(ROLE_CHANGE_EVENT, updateTheme);

    // Nettoyer les écouteurs d'événements lors du démontage du composant
    return () => {
      window.removeEventListener('storage', updateTheme);
      window.removeEventListener(ROLE_CHANGE_EVENT, updateTheme);
    };
  }, [currentRole]); // Dépendance sur currentRole pour réagir aux changements

  return theme;
}
