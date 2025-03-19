import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import { FormEvent, useState } from "react";
import { useLogin } from "./hooks/useLogin";
import {useNavigate} from "react-router-dom";

export function LoginForm() {
  /*TODO modifier les valeurs par défaut */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, data, error, loading } = useLogin();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await login(email, password);
    localStorage.setItem("emailUser", email);
    if (data?.token && !loading) {
      navigate("/home");
    }  }

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-md shadow-sm">
      <h1 className="mb-4 text-xl font-semibold">Connexion</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Mot de passe"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Se connecter
        </Button>
      </form>

      {loading && (
        <div className="flex items-center gap-2 mt-4">
          <CircularProgress size={20} />
          <span>Connexion en cours...</span>
        </div>
      )}

      {error && (
        <Alert severity="error" className="mt-4">
          Erreur lors de la connexion
        </Alert>
      )}
    </div>
  );
}
