import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import "./Auth.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const validate = () => {
        const errors = {};

        if (!username.trim()) {
            errors.username = "Choisissez un nom d'utilisateur.";
        } else if (username.trim().length < 3) {
            errors.username =
                "Le nom d'utilisateur doit contenir au moins 3 caractères.";
        }

        if (!email.trim()) {
            errors.email = "Saisissez votre adresse e-mail.";
        } else if (!EMAIL_RE.test(email.trim())) {
            errors.email = "Saisissez une adresse e-mail valide.";
        }

        if (!password) {
            errors.password = "Choisissez un mot de passe.";
        } else if (password.length < 8) {
            errors.password =
                "Le mot de passe doit contenir au moins 8 caractères.";
        }

        if (!confirmPassword) {
            errors.confirmPassword =
                "Confirmez votre mot de passe.";
        } else if (confirmPassword !== password) {
            errors.confirmPassword =
                "Les mots de passe ne correspondent pas.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!validate() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            await api.post("auth/register/", {
                username: username.trim(),
                email: email.trim(),
                password,
            });

            setIsDone(true);
        } catch (error) {
            setFormError(
                getErrorMessage(
                    error,
                    "Échec de l'inscription. Vérifiez vos informations."
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isDone) {
        return (
            <AuthLayout
                eyebrow="INSCRIPTION TERMINÉE"
                title="Compte créé avec succès"
                subtitle="Votre compte a été créé. Vous pouvez maintenant vous connecter."
            >
                <button
                    className="btn-primary"
                    onClick={() => navigate("/login")}
                >
                    Continuer vers la connexion
                </button>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            eyebrow="BIENVENUE"
            title="Créez votre compte"
            subtitle="Créez votre compte pour accéder à votre espace."
        >
            <form onSubmit={handleSignup} noValidate>
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
                    label="Adresse e-mail"
                    type="email"
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={fieldErrors.email}
                />

                <FormField
                    label="Mot de passe"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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

                {!fieldErrors.password && (
                    <p className="password-hint">
                        Utilisez au moins 8 caractères.
                    </p>
                )}

                <FormField
                    label="Confirmer le mot de passe"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirmez votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={fieldErrors.confirmPassword}
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
                    {isSubmitting
                        ? "Création du compte…"
                        : "Créer un compte"}
                </button>
            </form>

            <p className="auth-switch">
                Vous avez déjà un compte ?{" "}
                <Link to="/login">Se connecter</Link>
            </p>
        </AuthLayout>
    );
}

export default Signup;