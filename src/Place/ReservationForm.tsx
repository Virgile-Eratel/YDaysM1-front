import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Divider,
    Alert,
    CircularProgress,
    Snackbar
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import dayjs, { DATE_FORMAT } from "../utils/dateConfig";
import { PlaceType } from "../types/PlaceType";
import { useReservation } from "../hooks/useReservation";
import { loadStripe } from "@stripe/stripe-js";

// Initialiser Stripe avec la clé publique depuis les variables d'environnement
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface ReservationFormProps {
    place: PlaceType;
}

export default function ReservationForm({ place }: ReservationFormProps) {
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(2, 'day'));
    const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const { createReservation, createCheckoutSession, loading, error } = useReservation();

    // Calcul du nombre de jours et du prix total
    const durationInDays = endDate && startDate ? endDate.diff(startDate, 'day') : 0;
    const totalPrice = durationInDays * (place.price || 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setNotification({
                open: true,
                message: "Veuillez sélectionner des dates valides",
                severity: "error",
            });
            return;
        }

        if (durationInDays <= 0) {
            setNotification({
                open: true,
                message: "La date de fin doit être postérieure à la date de début",
                severity: "error",
            });
            return;
        }

        // Créer la réservation
        const reservationData = {
            place: `/get-one-place/${place.id}`,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            numberOfGuests,
        };

        const reservation = await createReservation(reservationData);

        if (reservation) {
            // Créer une session de paiement Stripe
            const sessionId = await createCheckoutSession(reservation.id);

            if (sessionId) {
                // Rediriger vers la page de paiement Stripe
                const stripe = await stripePromise;
                if (stripe) {
                    await stripe.redirectToCheckout({ sessionId });
                }
            } else {
                setNotification({
                    open: true,
                    message: "Erreur lors de la création de la session de paiement",
                    severity: "error",
                });
            }
        }
    };

    const handleCloseSnackbar = () => {
        setNotification({
            ...notification,
            open: false,
        });
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Réserver ce lieu
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Prix: {place.price}€ / nuit
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <DatePicker
                        label="Date d'arrivée"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        disablePast
                        format={DATE_FORMAT}
                        slotProps={{
                            textField: { fullWidth: true, required: true }
                        }}
                    />
                    <DatePicker
                        label="Date de départ"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        disablePast
                        format={DATE_FORMAT}
                        minDate={startDate ? startDate.add(1, 'day') : undefined}
                        slotProps={{
                            textField: { fullWidth: true, required: true }
                        }}
                    />
                </Box>

                <TextField
                    label="Nombre de personnes"
                    type="number"
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 1 } }}
                    sx={{ mb: 3 }}
                />

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                        Détails du prix:
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography>
                            {place.price}€ x {durationInDays} nuits
                        </Typography>
                        <Typography>
                            {totalPrice}€
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                        Total
                    </Typography>
                    <Typography variant="h6">
                        {totalPrice}€
                    </Typography>
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading || durationInDays <= 0}
                >
                    {loading ? <CircularProgress size={24} /> : "Réserver maintenant"}
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={notification.severity}
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}
