// Home.tsx
import { useEffect, useState } from 'react';
import Map from './Map';
import { PlaceType } from './types/PlaceType.ts';

function Home() {
  const [places, setPlaces] = useState<PlaceType[]>([]);

  // Fonction pour récupérer la liste des lieux
  async function getAllPlaces() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8080/get-all-places", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erreur de chargement des données");
    }

    return await response.json();
  }

  // Chargement des données lors du montage du composant
  useEffect(() => {
    async function fetchPlaces() {
      try {
        const placesData = await getAllPlaces();
        // On suppose que l'API renvoie les lieux dans la propriété "member"
        setPlaces(placesData.member);
        console.log(placesData);
      } catch (err) {
        console.error(err);
      }
    }

    fetchPlaces();
  }, []);

  return (
      <div className={"w-screen h-full"}>
        <Map places={places} />
        {places.length > 0 ? (
            <ul>
              {places.map((place) => (
                  <li key={place.id}>
                    {place.title} - {place.description} - {new Date(place.createdAt).toLocaleDateString()}
                  </li>
              ))}
            </ul>
        ) : (
            <p>Aucun lieu trouvé.</p>
        )}
      </div>
  );
}

export default Home;