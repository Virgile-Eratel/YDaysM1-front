import dayjs from 'dayjs';
import 'dayjs/locale/fr';

// Configurer dayjs pour utiliser le français
dayjs.locale('fr');

// Format de date standard pour l'application
export const DATE_FORMAT = 'DD/MM/YYYY';

// Fonction utilitaire pour formater les dates
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'Date inconnue';
  return dayjs(date).format(DATE_FORMAT);
};

export default dayjs;
