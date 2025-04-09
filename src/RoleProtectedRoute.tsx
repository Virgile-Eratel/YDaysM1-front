// RoleProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface RoleProtectedRouteProps {
    children: JSX.Element;
    requiredRole: string;
}

export function RoleProtectedRoute({ children, requiredRole }: RoleProtectedRouteProps) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("roleUser"));

    // Pour détecter un changement de token ou de role dans le localStorage (notamment dans d'autres onglets)
    useEffect(() => {
        const handleStorage = () => {
            setToken(localStorage.getItem("token"));
            setUserRole(localStorage.getItem("roleUser"));
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    // Vérifier si l'utilisateur est authentifié et a le rôle requis
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Vérifier si l'utilisateur a le rôle requis
    if (userRole !== requiredRole) {
        return <Navigate to="/home" replace />;
    }

    return children;
}
