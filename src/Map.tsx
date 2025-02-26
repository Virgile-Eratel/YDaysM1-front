// Map.tsx
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from "react";
import {PlaceType} from "./types/PlaceType.ts";

interface MapProps {
    places: PlaceType[];
}

export default function Map({ places }: MapProps) {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    // Création initiale de la carte
    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = 'pk.eyJ1Ijoidm1hcnR5IiwiYSI6ImNsb3VoOGd6MzBqbzYycWxscTl1Y3hseGoifQ.TqjbFkX4VC-euEvfTRz_lQ';
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [0, 0],
            zoom: 2,
        });

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    // Ajout des marqueurs et centrage de la carte en fonction des lieux
    useEffect(() => {
        if (!mapRef.current || places.length === 0) return;

        // Création d'une bounding box pour englober tous les points
        const bounds = new mapboxgl.LngLatBounds();

        places.forEach((place) => {
            // Définition des coordonnées sous la forme [longitude, latitude]
            const coordinates: [number, number] = [place.longitude, place.latitude];

            if (mapRef.current) {

                const popup = new mapboxgl.Popup({ offset: 25, closeButton: true, closeOnClick: false })
                    .setHTML(`<p class="text-black">${place.title}</p>`)
                    .addClassName('black-close-button');

                new mapboxgl.Marker()
                    .setLngLat(coordinates)
                    .setPopup(popup)
                    .addTo(mapRef.current);
            }

            // Extension de la bounding box pour inclure ce point
            bounds.extend(coordinates);
        });

        // Si un seul lieu est présent, centrer et zoomer dessus
        if (places.length === 1) {
            mapRef.current.setCenter([places[0].longitude, places[0].latitude]);
            mapRef.current.setZoom(12);
        } else {
            // Sinon, ajuster la vue pour inclure tous les marqueurs
            mapRef.current.fitBounds(bounds, { padding: 50 });
        }
    }, [places]);

    return (
        <div
            id="map-container"
            ref={mapContainerRef}
            style={{ width: '100%', height: '500px' }}  // Dimensions nécessaires pour l'affichage
        />
    );
}