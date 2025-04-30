import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PlaceType } from "../types/PlaceType.ts";
import { formatDate } from "../utils/dateConfig";
import { Divider, Box, Grid, Typography } from "@mui/material";
import ReviewsList from "./ReviewsList";
import AddReviewForm from "./AddReviewForm";
import ReservationForm from "./ReservationForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Place() {
    const { id } = useParams();
    const [place, setPlace] = useState<PlaceType>();
    const [error, setError] = useState<boolean>(false);
    const [refreshReviews, setRefreshReviews] = useState<number>(0);

    async function getPlaceById(id: string) {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/get-one-place/" + id, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            setError(true);
        }

        return await response.json();
    }

    useEffect(() => {
        if (id) {
            getPlaceById(id).then((data) => {
                setPlace(data);
            });
        }
    }, [id]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                {error ? (
                    <div className="text-center text-red-500 text-lg">
                        Erreur lors du chargement des données
                    </div>
                ) : place ? (
                    <>
                        <div>
                            {place.imageName ? (
                                <img
                                    src={`http://localhost:8080/images/place/${place.imageName}`}
                                    alt={`image-${place.title}`}
                                    className="w-full max-h-[400px] object-cover rounded-lg"
                                />
                            ) : (
                                <img
                                    src="/images/defPlace.png"
                                    alt={`image-${place.title}`}
                                    className="w-full max-h-[400px] object-cover rounded-lg"
                                />
                            )}
                        </div>

                        <Grid container spacing={4} sx={{ mt: 1 }}>
                            {/* Colonne de gauche: Détails du lieu */}
                            <Grid item xs={12} md={8}>
                                <div className="p-6 items-start justify-start flex flex-col">
                                    <h1 className="text-3xl font-bold my-6">{place.title}</h1>

                                    <p className="text-sm text-gray-500">Description</p>
                                    {
                                        place.description ? <p className="font-medium mb-4 text-start">{place.description}</p> :
                                            <p className={'text-gray-400 mb-4'}>Non renseignée</p>
                                    }
                                    <p className="text-sm text-gray-500">Date de publication</p>
                                    <p className="font-medium mb-4">
                                        {formatDate(place.createdAt)}
                                    </p>
                                    <p className="text-sm text-gray-500">Adresse</p>
                                    {
                                        place.address ? <p className="font-medium mb-4">{place.address}</p> :
                                            <p className={'text-gray-400 mb-4'}>Non renseignée</p>
                                    }
                                    <p className="text-sm text-gray-500">Prix</p>
                                    {
                                        place.price ?
                                            <p className="font-medium mb-4">{place.price > 0 ? `Prix : ${place.price}€ / jour` : "Gratuit"}</p> :
                                            <p className={'text-gray-400 mb-4'}>Non renseignée</p>
                                    }
                                    <Divider sx={{ my: 3, width: '100%' }} />

                                    <Box width="100%">
                                        <Typography variant="h6" gutterBottom>
                                            Commentaires et évaluations
                                        </Typography>
                                        <ReviewsList placeId={id || ''} key={refreshReviews} />

                                        <AddReviewForm
                                            placeId={id || ''}
                                            onReviewAdded={() => setRefreshReviews(prev => prev + 1)}
                                        />
                                    </Box>
                                </div>
                            </Grid>

                            {/* Colonne de droite: Formulaire de réservation */}
                            <Grid item xs={12} md={4}>
                                <ReservationForm place={place} />
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <div className="text-center text-gray-500">Chargement...</div>
                )}
            </div>
        </LocalizationProvider>
    );
}