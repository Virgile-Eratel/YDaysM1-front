import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Rating,
    Snackbar,
    CircularProgress
} from "@mui/material";
import Alert from "@mui/material/Alert";

interface AddReviewFormProps {
    placeId: string | number;
    onReviewAdded: () => void;
}

interface NotificationState {
    open: boolean;
    message: string;
    severity: "success" | "error";
}

export default function AddReviewForm({ placeId, onReviewAdded }: AddReviewFormProps) {
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState<number | null>(0);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        message: "",
        severity: "success",
    });

    // Récupérer l'ID utilisateur au chargement du composant
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("emailUser");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating) {
            setNotification({
                open: true,
                message: "Veuillez attribuer une note",
                severity: "error",
            });
            return;
        }

        if (!message.trim()) {
            setNotification({
                open: true,
                message: "Veuillez écrire un commentaire",
                severity: "error",
            });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!userId) {
                console.warn("ID utilisateur non trouvé dans localStorage");
                setNotification({
                    open: true,
                    message: "Impossible d'identifier l'utilisateur. Veuillez vous reconnecter.",
                    severity: "error",
                });
                setLoading(false);
                return;
            }

            console.log("Informations utilisateur:", { userId, userEmail });

            // Format des données selon l'exemple de l'API
            const reviewData = {
                message: message,
                rating: Number(rating),  // Assurez-vous que rating est un nombre
                author: `/get-one-user/${userId}`,
                place: `/get-one-place/${placeId}`
            };

            console.log("Envoi de la review:", reviewData);

            const response = await fetch("http://localhost:8080/reviews", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/ld+json",
                    "accept": "application/ld+json"
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Erreur API:", errorText);
                throw new Error(`Erreur lors de l'ajout du commentaire: ${response.status}`);
            }

            // Log de la réponse en cas de succès
            const responseData = await response.json();
            console.log("Réponse de l'API après ajout de review:", responseData);

            setNotification({
                open: true,
                message: "Commentaire ajouté avec succès !",
                severity: "success",
            });

            // Réinitialiser le formulaire
            setMessage("");
            setRating(0);

            // Informer le composant parent qu'un commentaire a été ajouté
            onReviewAdded();
        } catch (error) {
            console.error(error);
            setNotification({
                open: true,
                message: "Erreur lors de l'ajout du commentaire",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setNotification((prev) => ({
            ...prev,
            open: false,
        }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Ajouter un commentaire
            </Typography>

            {userEmail && (
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Vous commentez en tant que : {userEmail}
                </Typography>
            )}

            <Box display="flex" alignItems="center" mb={2}>
                <Typography component="legend" mr={2}>
                    Votre note:
                </Typography>
                <Rating
                    name="rating"
                    value={rating}
                    onChange={(_, newValue) => {
                        setRating(newValue);
                    }}
                    precision={1}
                    disabled={loading}
                />
            </Box>

            <TextField
                label="Votre commentaire"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                margin="normal"
                disabled={loading}
                required
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Publier"}
            </Button>

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
        </Box>
    );
}
