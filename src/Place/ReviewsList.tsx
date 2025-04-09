import { useEffect, useState, useMemo } from "react";
import { Box, Typography, Rating, Paper, Avatar, CircularProgress, Divider, Stack } from "@mui/material";
import dayjs from "dayjs";

interface UserType {
    id: number;
    email: string;
}

export interface ReviewType {
    id: number;
    message: string;
    rating: number;
    createdAt: string;
    author: UserType;
    place: string;
}

interface ReviewsListProps {
    placeId: string | number;
}

export default function ReviewsList({ placeId }: ReviewsListProps) {
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    // Calcul de la moyenne des notes
    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;

        // Filtrer les reviews qui ont une note valide (nombre)
        const validReviews = reviews.filter(review =>
            review.rating !== undefined &&
            review.rating !== null &&
            !isNaN(Number(review.rating))
        );

        if (validReviews.length === 0) return 0;

        // Calculer la somme en convertissant explicitement en nombre
        const sum = validReviews.reduce((acc, review) => acc + Number(review.rating), 0);
        return sum / validReviews.length;
    }, [reviews]);

    useEffect(() => {
        async function fetchReviews() {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                console.log(`Récupération des reviews pour la place ${placeId}`);
                const response = await fetch(`http://localhost:8080/place/${placeId}/reviews`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des commentaires");
                }

                const data = await response.json();
                console.log('Réponse brute de l\'API reviews:', data);

                // Gérer différentes structures de données possibles
                let reviewsData = [];

                if (Array.isArray(data)) {
                    // Si la réponse est déjà un tableau
                    reviewsData = data;
                } else if (data.member && Array.isArray(data.member)) {
                    // Si la réponse a une propriété 'member' qui est un tableau
                    reviewsData = data.member;
                } else if (data['hydra:member'] && Array.isArray(data['hydra:member'])) {
                    // Format API Platform avec hydra
                    reviewsData = data['hydra:member'];
                } else {
                    // Si aucun format reconnu, on utilise un tableau vide
                    console.warn('Format de données de reviews non reconnu:', data);
                    reviewsData = [];
                }

                console.log('Reviews data traitées:', reviewsData);
                setReviews(reviewsData);
            } catch (err) {
                console.error('Erreur lors du chargement des reviews:', err);
                setError(true);
                // Afficher l'erreur dans la console pour le débogage
                if (err instanceof Error) {
                    console.error('Message d\'erreur:', err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        if (placeId) {
            fetchReviews();
        }
    }, [placeId]);

    // Rendu conditionnel en fonction de l'état
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" my={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" my={2}>
                Erreur lors du chargement des commentaires
            </Typography>
        );
    }

    if (reviews.length === 0) {
        return (
            <Typography color="text.secondary" my={2}>
                Aucun commentaire pour le moment
            </Typography>
        );
    }

    return (
        <Box>
            <Box mb={3} className="flex items-start justify-start flex-col">
                <p className="text-sm text-gray-500 ">Notes moyennes</p>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating
                        value={averageRating}
                        readOnly
                        precision={0.1}
                    />
                    <Typography variant="body1" fontWeight="bold">
                        {averageRating.toFixed(1)}/5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ({reviews.length} avis)
                    </Typography>
                </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
                Commentaires ({reviews.length})
            </Typography>

            {reviews.map((review) => {
                // Détermination de l'email et de l'initiale en fonction du type de "author"
                let authorEmail = "Utilisateur anonyme";
                let authorInitial = "U";

                try {
                    if (review.author) {
                        if (review.author.email) {
                            authorEmail = review.author.email;
                            authorInitial = review.author.email.charAt(0).toUpperCase();
                        } else {
                            authorEmail = `Anonyme`;
                            authorInitial = "A";
                        }
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'extraction des informations de l\'auteur:', error);
                }

                return (
                    <Paper key={review.id} elevation={1} sx={{ p: 2, mb: 2 }}>
                        <Box display="flex" mb={1}>
                            <Avatar sx={{ mr: 2 }}>
                                {authorInitial}
                            </Avatar>
                            <Box display="flex" alignItems="between" width="100%">
                            <Box display="flex" flexDirection="column" alignItems="flex-start" >
                                <Typography variant="subtitle1">
                                    {authorEmail}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {review.createdAt ? dayjs(review.createdAt).format("DD MMMM YYYY") : "Date inconnue"}
                                </Typography>
                            </Box>
                                <Box display="flex" flexDirection="column" alignItems="flex-start" flex="1"/>

                                <Rating value={Number(review.rating) || 0} readOnly precision={1} sx={{ mb: 1 }} />
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="flex-start" mb={1}>
                        <Typography variant="body1">
                            {review.message}
                        </Typography>
                        </Box>
                    </Paper>
                );
            })}
        </Box>
    );
}