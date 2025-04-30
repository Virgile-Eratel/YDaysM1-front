import { useEffect, useState } from 'react';
import Map from './Places/Map';
import PlacesList from './Places/PlacesList';
import { PlaceType } from './types/PlaceType';
import { Fab } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import MapIcon from '@mui/icons-material/Map';
import {SearchBarPlace} from "./components/SearchBarPlace.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "./utils/dateConfig";

function Home() {
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>

      <div className="w-full h-full" style={{ position: 'relative', paddingBottom: '80px' }}>
          <div className={"flex justify-center pb-3"}>
          <SearchBarPlace/>
          </div>
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
      </LocalizationProvider>
  );
}

export default Home;