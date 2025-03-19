// Home.tsx
import { useEffect, useState } from 'react';
import Map from './Places/Map';
import PlacesList from './Places/PlacesList';
import { PlaceType } from './types/PlaceType';
import { Fab } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import MapIcon from '@mui/icons-material/Map';

function Home() {
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [view, setView] = useState<'map' | 'list'>('map');

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

  const handleViewToggle = () => {
    setView((prev) => (prev === 'map' ? 'list' : 'map'));
  };

  return (
      <div className="w-full h-full" style={{ position: 'relative', paddingBottom: '80px' }}>
        {places.length <= 0 ? (
            <div className="text-xl text-center">
              Il semble qu'aucun lieu n'est disponible
            </div>
        ) : view === 'map' ? (
            <Map places={places} />
        ) : (
            <PlacesList places={places} />
        )}

        <Fab
            color="inherit"
            variant="extended"
            onClick={handleViewToggle}
            sx={{
              position: 'fixed',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
        >
          {view === 'map' ? <ListIcon sx={{ mr: 1 }} /> : <MapIcon sx={{ mr: 1 }} />}
          {view === 'map' ? "Liste" : "Carte"}
        </Fab>
      </div>
  );
}

export default Home;