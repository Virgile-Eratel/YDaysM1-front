import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, CircularProgress, Alert } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useReservation } from "../hooks/useReservation";
import { ReservationType } from "../types/ReservationType";

export default function ReservationSuccess() {
    const { id } = useParams<{ id: string }>();
    const [reservation, setReservation] = useState<ReservationType | null>(null);
    const { getReservation, loading, error } = useReservation();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchReservation() {
            if (id) {
                const data = await getReservation(id);
                setReservation(data);
            }
        }
        fetchReservation();
    }, [id]);

    if (loading) {
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

    if (!reservation) {
        return (
            <Alert severity="warning" sx={{ mt: 3 }}>
                Réservation non trouvée
            </Alert>
        );
    }

    const place = typeof reservation.place === 'object' ? reservation.place : { title: 'Lieu inconnu' };

    return (
        <Box sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                
                <Typography variant="h4" gutterBottom>
                    Réservation confirmée !
                </Typography>
                
                <Typography variant="body1" paragraph>
                    Votre réservation pour <strong>{place.title}</strong> a été confirmée avec succès.
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                    Un email de confirmation a été envoyé à votre adresse email.
                </Typography>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate('/reservations')}
                    >
                        Voir mes réservations
                    </Button>
                    
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => navigate('/home')}
                    >
                        Retour à l'accueil
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
