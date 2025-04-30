import { useState } from 'react';
import { PlaceType } from '../types/PlaceType';
import { Dayjs } from 'dayjs';

interface SearchParams {
  location?: string;
  date?: Dayjs | null;
  time?: Dayjs | null;
  guests?: number | null;
}

export function usePlaceSearch() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function getAllPlaces(): Promise<PlaceType[]> {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/get-all-places`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur de chargement des données");
      }

      const data = await response.json();
      // On suppose que l'API renvoie les lieux dans la propriété "member"
      return data.member || [];
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

  function filterPlaces(places: PlaceType[], params: SearchParams): PlaceType[] {
    return places.filter(place => {
      // Filtre par lieu (titre ou adresse)
      if (params.location && params.location.trim() !== '') {
        const locationLower = params.location.toLowerCase();
        const titleMatch = place.title?.toLowerCase().includes(locationLower);
        const addressMatch = place.address?.toLowerCase().includes(locationLower);
        
        if (!titleMatch && !addressMatch) {
          return false;
        }
      }

      /*TODO voir pour faire filtres par date et nombre de personnes*/
      return true;
    });
  }

  async function searchPlaces(params: SearchParams): Promise<PlaceType[]> {
    try {
      const allPlaces = await getAllPlaces();
      return filterPlaces(allPlaces, params);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      return [];
    }
  }

  return {
    searchPlaces,
    loading,
    error
  };
}
