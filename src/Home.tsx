import { useEffect, useState } from 'react';
import Map from './Places/Map';
import PlacesList from './Places/PlacesList';
import { PlaceType } from './types/PlaceType';
import { Fab, Alert, Snackbar } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import MapIcon from '@mui/icons-material/Map';
import {SearchBarPlace} from "./components/SearchBarPlace.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { usePlaceSearch } from './hooks/usePlaceSearch';

function Home() {
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceType[]>([]);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [notification, setNotification] = useState<{open: boolean; message: string; severity: 'success' | 'error' | 'info'}>({open: false, message: '', severity: 'info'});

  const { searchPlaces } = usePlaceSearch();

  useEffect(() => {
    async function fetchPlaces() {
      try {
        setLoading(true);
        const results = await searchPlaces({});
        setFilteredPlaces(results);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    }
    fetchPlaces();
  }, []);

  const handleSearch = async (searchParams: any) => {
    try {
      setLoading(true);
      const results = await searchPlaces(searchParams);
      setFilteredPlaces(results);

      if (results.length === 0) {
        setNotification({
          open: true,
          message: 'Aucun résultat trouvé pour votre recherche.',
          severity: 'info'
        });
      } else {
        setNotification({
          open: true,
          message: `${results.length} résultat(s) trouvé(s).`,
          severity: 'success'
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        open: true,
        message: 'Erreur lors de la recherche. Veuillez réessayer.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewToggle = () => {
    setView((prev) => (prev === 'map' ? 'list' : 'map'));
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-full h-full" style={{ position: 'relative', paddingBottom: '80px' }}>
        <div className={"flex justify-center pb-3"}>
          <SearchBarPlace onSearch={handleSearch} loading={loading} />
        </div>

        {loading && filteredPlaces.length === 0 ? (
          <div className="text-xl text-center p-10">
            Chargement des lieux...
          </div>
        ) : error ? (
          <div className="text-xl text-center text-red-500 p-10">
            Une erreur est survenue lors du chargement des lieux
          </div>
        ) : filteredPlaces.length <= 0 ? (
          <div className="text-xl text-center p-10">
            Aucun espace ne correspond à votre recherche
          </div>
        ) : view === 'map' ? (
          <Map places={filteredPlaces} />
        ) : (
          <PlacesList places={filteredPlaces} />
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

        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </div>
    </LocalizationProvider>
  );
}

export default Home;