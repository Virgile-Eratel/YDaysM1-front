import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";
import { PlaceType } from "../types/PlaceType.ts";
import { useNavigate } from "react-router-dom";

interface PlacesListProps {
    places: PlaceType[];
}

export default function PlacesGrid({ places }: PlacesListProps) {
    const navigate = useNavigate();

    return (
        <Grid container spacing={3}>
            {places.map((place) => (
                <Grid item key={place.id} xs={12} sm={6} md={4} lg={3}>
                    <Card
                        sx={{ cursor: "pointer", height: "100%" }}
                        onClick={() => navigate(`/place/${place.id}`)}
                    >
                        <CardMedia
                            component="img"
                            image={place.imageName
                                ? `http://localhost:8080/images/place/${place.imageName}`
                                : "images/defPlace.png"}
                            alt={place.title}
                            sx={{
                                height: 230,
                                width: "100%",
                                objectFit: "cover",
                                borderRadius: "16px"
                            }}
                        />
                        <CardContent className={"text-start"}>
                            {
                                place.title &&
                                <Typography variant="h6">{place.title}</Typography>
                            }
                            {
                                place.address &&
                                <Typography variant="body2" color="text.secondary">
                                    {place.address}
                                </Typography>
                            }
                            {
                                place.price != undefined &&
                                <Typography variant="subtitle1" fontWeight="semibold">
                                    { place.price > 0 ? `Prix : ${place.price}€` : "Gratuit" }
                                </Typography>
                            }
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}