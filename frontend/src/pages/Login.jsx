import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const errors = {};

        if (!username.trim()) {
            errors.username = "Saisissez votre nom d'utilisateur.";
        }

        if (!password) {
            errors.password = "Saisissez votre mot de passe.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!validate() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const response = await api.post("login/", {
                username,
                password,
            });

            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);

            navigate("/");
        } catch (error) {
            setFormError(
                getErrorMessage(
                    error,
                    "Échec de la connexion. Vérifiez votre nom d'utilisateur et votre mot de passe."
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            eyebrow="BON RETOUR"
            title="Connectez-vous à votre compte"
            subtitle="Saisissez vos informations pour accéder à votre espace."
        >
            <form onSubmit={handleLogin} noValidate>
                <FormField
                    label="Nom d'utilisateur"
                    type="text"
                    autoComplete="username"
                    placeholder="Votre nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={fieldErrors.username}
                />

                <FormField
                    label="Mot de passe"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={fieldErrors.password}
                    endAdornment={
                        <button
                            type="button"
                            className="field__toggle"
                            onClick={() => setShowPassword((v) => !v)}
                        >
                            {showPassword ? "Masquer" : "Afficher"}
                        </button>
                    }
                />

                {formError && (
                    <p className="form-error" role="alert">
                        {formError}
                    </p>
                )}

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Connexion…" : "Se connecter"}
                </button>
            </form>

            <p className="auth-switch">
                Vous n'avez pas encore de compte ?{" "}
                <Link to="/signup">Créer un compte</Link>
            </p>
        </AuthLayout>
    );
}

export default Login;