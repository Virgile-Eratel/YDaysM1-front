import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {PlaceType} from "../types/PlaceType.ts";

export default function Place() {
    const params = useParams();
    const id = params.id;

    const [place, setPlace] = useState<PlaceType>();
    const [error, setError] = useState<boolean>(false);


    async function getPlaceById(id: string) {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/get-one-place/"+id, {
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
        if(id){
            getPlaceById(id).then(r => {
                setPlace(r)
            });
        }
    }, [id]);

    return (
        <div className={"w-full h-full justify-center items-center flex"}>
            {error ?

                <p>Erreur lors du chargement des données</p>
                    : place ?
                (
                <div>
                    <div className={"h-52 w-52 object-contain"}>
                    {
                        place.imageName ? (
                            <img src={`http://localhost:8080/images/place/${place.imageName}`} alt={`image-${place.title}`} />
                        ) : (
                            <img src="/images/defPlace.png" alt={`image-${place.title}`} />
                        )
                    }
                    </div>
                    <h1>{place.title}</h1>
                    <p>{place.description}</p>
                    <p>{new Date(place.createdAt).toLocaleDateString()}</p>
                    <p>{place.address}</p>
                    <p>{place.price}</p>
                    <p>{place.host}</p>
                </div>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    )
}