import {Add} from "@mui/icons-material";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

export function CreatePlaceHome() {

    const navigate = useNavigate();

    return (
        <div className="w-full h-full items-center flex flex-col space-y-20">
            <div className="relative ">
                <img
                    src={`/images/addPlace.jpg`}
                    alt={`image ajout place`}
                    className="w-[95vw] max-h-[400px] object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 rounded-lg" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-white text-3xl md:text-5xl lg:text-7xl font-bold px-4 md:px-6 py-2 rounded-lg text-center">
                        Gagnez de l’argent en ajoutant votre/vos pièce(s)
                    </h1>
                </div>
            </div>
            <p className={'p-4 text-sm md:text-base text-center md:text-left max-w-4xl mx-auto'}>
                Transformez votre espace inutilisé en source de revenus ! Que vous disposiez d’un bureau libre, d’une salle lumineuse ou d’un coin tranquille, mettez-le à disposition des télétravailleurs à la recherche d’un endroit confortable et inspirant. En quelques clics, louez votre espace selon vos conditions et rejoignez une communauté qui valorise flexibilité, proximité et convivialité. Profitez d’un revenu complémentaire tout en aidant d’autres à mieux travailler, près de chez vous.
            </p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-16 w-full items-center justify-center">
            <Button
                variant="outlined"
                color="primary"
                startIcon={<Add />}
                onClick={() => navigate("/create-place")}
                sx={{
                    width: { xs: '90%', sm: '80%', md: 'auto' },
                    mb: { xs: 2, md: 0 }
                }}
            >
                Ajouter votre espace
            </Button>
            <Button
                variant="contained"
                color="primary"
                disabled
                title={"Fonctionnalité en cours de développement"}
                sx={{
                    width: { xs: '90%', sm: '80%', md: 'auto' }
                }}
            >
                Demandez à un de nos co-hôtes
            </Button>
            </div>
        </div>
    );
}