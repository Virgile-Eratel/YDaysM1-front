// src/hooks/useLogin.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// On peut définir précisément la forme du JSON renvoyé par l’API
// Ici, on suppose qu’il n’y a qu’un champ "token" dans la réponse :
interface LoginResponseData {
  token: string;
}

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<void>;
  data: LoginResponseData | null;
  error: string | null;
  loading: boolean;
}

export function useLogin(): UseLoginReturn {
  const navigate = useNavigate();
  const [data, setData] = useState<LoginResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function login(email: string, password: string): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur (status: ${response.status})`);
      }

      // Récupération du token (si le format de la réponse est { "token": "..." })
      const responseData: LoginResponseData = await response.json();

      // Stockage du token dans le state
      setData(responseData);

      // Stockage du token dans localStorage (pour usage ultérieur)
      localStorage.setItem("token", responseData.token);

      // Redirection vers la page d’accueil ("/home", par exemple)
      navigate("/home");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    login,
    data,
    error,
    loading,
  };
}
