import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Divider,
    Button,
    Grid,
    Chip,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";
import { useReservation } from "../hooks/useReservation";
import { ReservationType } from "../types/ReservationType";
import { useNavigate, useLocation } from "react-router-dom";
import { formatDate } from "../utils/dateConfig";

export default function UserReservations() {
    const [reservations, setReservations] = useState<ReservationType[]>([]);
    const { getUserReservations, cancelReservation, loading, error } = useReservation();
    const navigate = useNavigate();
    const location = useLocation();
    const [notification, setNotification] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});

    // Vérifier les paramètres d'URL pour les messages de paiement
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('payment_success') === 'true') {
            setNotification({
                open: true,
                message: 'Paiement effectué avec succès ! Votre réservation est confirmée.',
                severity: 'success'
            });
            // Nettoyer l'URL
            navigate('/reservations', { replace: true });
        } else if (searchParams.get('payment_canceled') === 'true') {
            setNotification({
                open: true,
                message: 'Paiement annulé. Votre réservation est toujours en attente.',
                severity: 'error'
            });
            // Nettoyer l'URL
            navigate('/reservations', { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        async function fetchReservations() {
            const data = await getUserReservations();
            setReservations(data);
        }
        fetchReservations();
    }, []);

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const handleCancelReservation = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
            const success = await cancelReservation(id);
            if (success) {
                // Mettre à jour la liste des réservations
                setReservations(prevReservations =>
                    prevReservations.map(res =>
                        res.id === id ? { ...res, status: 'cancelled' } : res
                    )
                );

                // Afficher une notification de succès
                setNotification({
                    open: true,
                    message: 'Réservation annulée avec succès.',
                    severity: 'success'
                });
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            case 'completed':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmée';
            case 'pending':
                return 'En attente';
            case 'cancelled':
                return 'Annulée';
            case 'completed':
                return 'Terminée';
            default:
                return status;
        }
    };

    if (loading && reservations.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 3 }}>
                {error}
            </Alert>
        );
    }

    if (reservations.length === 0) {
        return (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Mes réservations
                </Typography>
                <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
                    <Typography>
                        Vous n'avez pas encore de réservations.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/home')}
                    >
                        Explorer les lieux
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Mes réservations
            </Typography>

            <Grid container spacing={3}>
                {reservations.map((reservation) => {
                    const place = typeof reservation.place === 'object' ? reservation.place : { title: 'Lieu inconnu', address: '', imageName: '' };

                    return (
                        <Grid item xs={12} md={6} key={reservation.id}>
                            <Paper elevation={2} sx={{ p: 0, overflow: 'hidden' }}>
                                <Box sx={{ position: 'relative' }}>
                                    <img
                                        src={place.imageName
                                            ? `http://localhost:8080/images/place/${place.imageName}`
                                            : "/images/defPlace.png"
                                        }
                                        alt={place.title}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            filter: reservation.status === 'cancelled' ? 'grayscale(100%)' : 'none'
                                        }}
                                    />
                                    <Chip
                                        label={getStatusLabel(reservation.status)}
                                        color={getStatusColor(reservation.status) as any}
                                        sx={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Box>

                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6">{place.title}</Typography>
                                    {place.address && (
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {place.address}
                                        </Typography>
                                    )}

                                    <Divider sx={{ my: 1.5 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Date d'arrivée
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatDate(reservation.startDate)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Date de départ
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatDate(reservation.endDate)}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Nombre de personnes
                                        </Typography>
                                        <Typography variant="body1">
                                            {reservation.numberOfGuests}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1.5 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6">
                                            Total: {reservation.totalPrice}€
                                        </Typography>

                                        {reservation.status === 'pending' && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleCancelReservation(reservation.id)}
                                                disabled={loading}
                                            >
                                                Annuler
                                            </Button>
                                        )}

                                        {reservation.status === 'confirmed' && (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => navigate(`/place/${typeof reservation.place === 'object' ? reservation.place.id : ''}`)}
                                            >
                                                Voir le lieu
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Notification pour le résultat du paiement */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
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
        </Box>
    );
}
