// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    // Pour détecter un changement de token dans le localStorage (notamment dans d'autres onglets)
    useEffect(() => {
        const handleStorage = () => {
            setToken(localStorage.getItem("token"));
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return token ? children : <Navigate to="/login" replace />;
}