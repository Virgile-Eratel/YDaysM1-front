import { useState } from "react";
import { ReservationType } from "../types/ReservationType";

interface UseReservationReturn {
  createReservation: (reservationData: Partial<ReservationType>) => Promise<ReservationType | null>;
  getUserReservations: () => Promise<ReservationType[]>;
  getReservation: (id: string | number) => Promise<ReservationType | null>;
  cancelReservation: (id: string | number) => Promise<boolean>;
  createCheckoutSession: (reservationId: string | number) => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

export function useReservation(): UseReservationReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function createReservation(reservationData: Partial<ReservationType>): Promise<ReservationType | null> {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("Vous devez être connecté pour effectuer une réservation");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/reservations`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify({
          ...reservationData,
          user: `/get-one-user/${userId}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création de la réservation");
      }

      return await response.json();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function getUserReservations(): Promise<ReservationType[]> {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("Vous devez être connecté pour voir vos réservations");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/user/${userId}/reservations`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des réservations");
      }

      const data = await response.json();
      return data.member || data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function getReservation(id: string | number): Promise<ReservationType | null> {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Vous devez être connecté pour voir cette réservation");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/get-one-reservation/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la réservation");
      }

      return await response.json();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function cancelReservation(id: string | number): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Vous devez être connecté pour annuler cette réservation");
      }

      // Utiliser la route spécifique pour annuler la réservation
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reservations/${id}/cancel`, {
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

  async function createCheckoutSession(reservationId: string | number): Promise<string | null> {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Vous devez être connecté pour effectuer un paiement");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/create-checkout-session/${reservationId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création de la session de paiement");
      }

      const data = await response.json();
      return data.id;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    createReservation,
    getUserReservations,
    getReservation,
    cancelReservation,
    createCheckoutSession,
    loading,
    error,
  };
}
