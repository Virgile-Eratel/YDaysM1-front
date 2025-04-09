import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PlaceType } from "../types/PlaceType.ts";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import { Divider, Box } from "@mui/material";
import ReviewsList from "./ReviewsList";
import AddReviewForm from "./AddReviewForm";
dayjs.locale('fr');

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
                        <div className="p-6 items-start justify-start flex flex-col">
                            <h1 className="text-3xl font-bold my-6">{place.title}</h1>

                            <p className="text-sm text-gray-500">Description</p>
                            {
                                place.description ? <p className="font-medium mb-4 text-start">{place.description}</p> :
                                    <p className={'text-gray-400 mb-4'}>Non renseignée</p>
                            }
                            <p className="text-sm text-gray-500">Date de publication</p>
                            <p className="font-medium mb-4">
                                {dayjs(place.createdAt).format('DD MMMM YYYY')}
                            </p>
                            <p className="text-sm text-gray-500">Adresse</p>
                            {
                                place.address ? <p className="font-medium mb-4">{place.address}</p> :
                                    <p className={'text-gray-400 mb-4'}>Non renseignée</p>
                            }
                            <p className="text-sm text-gray-500">Prix</p>
                            {
                                place.price ?
                                    <p className="font-medium mb-4">{place.price > 0 ? `Prix : ${place.price}€` : "Gratuit"}</p> :
                                    <p className={'text-gray-400 mb-4'}>Non renseignée</p>
                            }
                            <Divider sx={{ my: 3, width: '100%' }} />

                            <Box width="100%">

                                <ReviewsList placeId={id || ''} key={refreshReviews} />

                                <AddReviewForm
                                    placeId={id || ''}
                                    onReviewAdded={() => setRefreshReviews(prev => prev + 1)}
                                />
                            </Box>

                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500">Chargement...</div>
                )}
            </div>
    );
}