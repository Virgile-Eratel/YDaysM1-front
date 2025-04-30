import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, CircularProgress, Alert } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useReservation } from "../hooks/useReservation";
import { ReservationType } from "../types/ReservationType";

export default function ReservationError() {
    const { id } = useParams<{ id: string }>();
    const [reservation, setReservation] = useState<ReservationType | null>(null);
    const { getReservation, createCheckoutSession, loading, error } = useReservation();
    const navigate = useNavigate();
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        async function fetchReservation() {
            if (id) {
                const data = await getReservation(id);
                setReservation(data);
            }
        }
        fetchReservation();
    }, [id]);

    const handleRetryPayment = async () => {
        if (!reservation) return;

        setProcessingPayment(true);

        try {
            // Créer une nouvelle session de paiement Stripe
            const stripePromise = (await import('@stripe/stripe-js')).loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
            const sessionId = await createCheckoutSession(reservation.id);

            if (sessionId) {
                // Rediriger vers la page de paiement Stripe
                const stripe = await stripePromise;
                if (stripe) {
                    await stripe.redirectToCheckout({ sessionId });
                }
            }
        } catch (error) {
            console.error("Erreur lors de la création de la session de paiement", error);
        } finally {
            setProcessingPayment(false);
        }
    };

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
                <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />

                <Typography variant="h4" gutterBottom>
                    Paiement non complété
                </Typography>

                <Typography variant="body1" paragraph>
                    Le paiement pour votre réservation à <strong>{place.title}</strong> n'a pas été complété.
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                    Votre réservation est toujours en attente de paiement. Vous pouvez réessayer ou annuler la réservation.
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
                        onClick={handleRetryPayment}
                        disabled={processingPayment}
                    >
                        {processingPayment ? <CircularProgress size={24} /> : "Réessayer le paiement"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
