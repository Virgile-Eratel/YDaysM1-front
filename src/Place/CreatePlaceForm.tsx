import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    CircularProgress
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

interface FormValues {
    title: string;
    description: string;
    address: string;
    latitude: string;
    longitude: string;
    price: string;
}

interface NotificationState {
    open: boolean;
    message: string;
    severity: "success" | "error";
}

export default function CreatePlaceForm() {
    const [formValues, setFormValues] = useState<FormValues>({
        title: "",
        description: "",
        address: "",
        latitude: "",
        longitude: "",
        price: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        message: "",
        severity: "success",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleCloseSnackbar = (
        _event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setNotification((prev) => ({
            ...prev,
            open: false,
        }));
    };

    const handleUseCurrentPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormValues((prev) => ({
                        ...prev,
                        latitude: latitude.toString(),
                        longitude: longitude.toString(),
                    }));
                    setNotification({
                        open: true,
                        message: "Position actuelle récupérée avec succès.",
                        severity: "success",
                    });
                },
                (error) => {
                    console.error(error);
                    // Vérifier le code d'erreur et informer l'utilisateur en conséquence
                    if (error.code === 2) {
                        setNotification({
                            open: true,
                            message: "La position est indisponible. Veuillez saisir manuellement l'adresse ou vérifier vos services de localisation.",
                            severity: "error",
                        });
                    } else {
                        setNotification({
                            open: true,
                            message: "Erreur lors de la récupération de la position.",
                            severity: "error",
                        });
                    }
                }
            );
        } else {
            setNotification({
                open: true,
                message: "La géolocalisation n'est pas supportée par votre navigateur.",
                severity: "error",
            });
        }
    };

    // Utilise le service Nominatim d'OpenStreetMap pour géocoder l'adresse saisie
    const handleGeocodeAddress = async () => {
        if (!formValues.address) {
            setNotification({
                open: true,
                message: "Veuillez saisir une adresse pour la géocodification.",
                severity: "error",
            });
            return;
        }
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    formValues.address
                )}`
            );
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setFormValues((prev) => ({
                    ...prev,
                    latitude: lat,
                    longitude: lon,
                }));
                setNotification({
                    open: true,
                    message: "Géocodification réussie.",
                    severity: "success",
                });
            } else {
                setNotification({
                    open: true,
                    message: "Aucun résultat trouvé pour cette adresse.",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error(error);
            setNotification({
                open: true,
                message: "Erreur lors du géocodage de l'adresse.",
                severity: "error",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", formValues.title);
        formData.append("description", formValues.description);
        formData.append("address", formValues.address);
        formData.append("latitude", formValues.latitude);
        formData.append("longitude", formValues.longitude);
        formData.append("price", formValues.price);
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/places", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                setNotification({
                    open: true,
                    message: "Erreur lors de la création de l'espace.",
                    severity: "error",
                });
                setLoading(false);
                return;
            }

            setNotification({
                open: true,
                message: "Lieu créé avec succès ! Redirection en cours...",
                severity: "success",
            });
            // Réinitialiser le formulaire
            setFormValues({
                title: "",
                description: "",
                address: "",
                latitude: "",
                longitude: "",
                price: "",
            });
            setImageFile(null);

            setTimeout(() => {
                navigate("/home");
            }, 3000);
        } catch (error) {
            console.error(error);
            setNotification({
                open: true,
                message: "Erreur lors de la création de l'espace.",
                severity: "error",
            });
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    maxWidth: "600px",
                    mx: "auto",
                    mt: 4,
                    p: 3,
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: 2,
                    backgroundColor: "#fff",
                }}
            >
                <Typography variant="h5" fontWeight="bold" textAlign="center">
                    Ajouter votre espace
                </Typography>
                <TextField
                    label="Titre"
                    name="title"
                    value={formValues.title}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    disabled={loading}
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    multiline
                    rows={4}
                    disabled={loading}
                />
                <TextField
                    label="Adresse"
                    name="address"
                    value={formValues.address}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    disabled={loading}
                />

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                        variant="outlined"
                        onClick={handleUseCurrentPosition}
                        disabled={loading}
                    >
                        Utiliser ma position actuelle
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleGeocodeAddress}
                        disabled={loading}
                    >
                        Géocoder l'adresse
                    </Button>
                </Box>

                <TextField
                    label="Latitude"
                    name="latitude"
                    value={formValues.latitude}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    type="number"
                    disabled={loading}
                />
                <TextField
                    label="Longitude"
                    name="longitude"
                    value={formValues.longitude}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    type="number"
                    disabled={loading}
                />
                <TextField
                    label="Prix"
                    name="price"
                    value={formValues.price}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    type="number"
                    disabled={loading}
                />

                {/* Champ pour envoyer un fichier */}
                <Button variant="outlined" component="label" disabled={loading}>
                    Ajouter une image
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
                {imageFile && (
                    <Typography variant="caption">
                        Fichier sélectionné : {imageFile.name}
                    </Typography>
                )}

                <Button variant="contained" type="submit" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Ajouter l'espace"}
                </Button>
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
        </>
    );
}