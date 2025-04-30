import { useState } from "react";

interface OwnerReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
}

export interface OwnerReservation {
  id: number;
  startDate: string;
  endDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  place: {
    id: number;
    title: string;
    address: string;
    price: number;
  };
  user: {
    id: number;
    email: string;
  };
}

interface OwnerReservationsResponse {
  reservations: OwnerReservation[];
  stats: OwnerReservationStats;
}

interface UseOwnerReservationsReturn {
  reservations: OwnerReservation[];
  stats: OwnerReservationStats;
  loading: boolean;
  error: string | null;
  fetchReservations: () => Promise<void>;
  completeReservation: (id: number) => Promise<boolean>;
  confirmReservation: (id: number) => Promise<boolean>;
  cancelReservation: (id: number) => Promise<boolean>;
}

export function useOwnerReservations(): UseOwnerReservationsReturn {
  const [reservations, setReservations] = useState<OwnerReservation[]>([]);
  const [stats, setStats] = useState<OwnerReservationStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchReservations(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Vous devez être connecté pour accéder à cette page");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/owner/reservations`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la récupération des réservations");
      }

      const data: OwnerReservationsResponse = await response.json();
      setReservations(data.reservations);
      setStats(data.stats);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  }

  async function completeReservation(id: number): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Vous devez être connecté pour marquer une réservation comme terminée");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reservations/${id}/complete`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour de la réservation");
      }

      // Mettre à jour l'état local
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.id === id ? { ...res, status: 'completed' } : res
        )
      );

      // Mettre à jour les statistiques
      setStats(prevStats => ({
        ...prevStats,
        confirmed: prevStats.confirmed - 1,
        completed: prevStats.completed + 1
      }));

      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function confirmReservation(id: number): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Vous devez être connecté pour confirmer une réservation");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reservations/${id}/confirm`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la confirmation de la réservation");
      }

      // Mettre à jour l'état local
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.id === id ? { ...res, status: 'confirmed' } : res
        )
      );

      // Mettre à jour les statistiques
      setStats(prevStats => ({
        ...prevStats,
        pending: prevStats.pending - 1,
        confirmed: prevStats.confirmed + 1
      }));

      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function cancelReservation(id: number): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Vous devez être connecté pour annuler une réservation");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reservations/${id}/owner-cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'annulation de la réservation");
      }

      // Récupérer la réservation pour connaître son statut précédent
      const reservation = reservations.find(res => res.id === id);

      // Mettre à jour l'état local
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.id === id ? { ...res, status: 'cancelled' } : res
        )
      );

      // Mettre à jour les statistiques
      setStats(prevStats => {
        const newStats = { ...prevStats, cancelled: prevStats.cancelled + 1 };

        // Décrémenter le compteur approprié selon le statut précédent
        if (reservation?.status === 'pending') {
          newStats.pending = prevStats.pending - 1;
        } else if (reservation?.status === 'confirmed') {
          newStats.confirmed = prevStats.confirmed - 1;
        }

        return newStats;
      });

      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    reservations,
    stats,
    loading,
    error,
    fetchReservations,
    completeReservation,
    confirmReservation,
    cancelReservation
  };
}
