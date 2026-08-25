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
        if (!username.trim()) errors.username = "Enter your username.";
        if (!password) errors.password = "Enter your password.";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!validate() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await api.post("login/", { username, password });

            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);

            navigate("/");
        } catch (error) {
            setFormError(
                getErrorMessage(error, "Login failed. Check your username and password.")
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            eyebrow="WELCOME BACK"
            title="Log in to your account"
            subtitle="Enter your details to access your membership."
        >
            <form onSubmit={handleLogin} noValidate>
                <FormField
                    label="Username"
                    type="text"
                    autoComplete="username"
                    placeholder="yourusername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={fieldErrors.username}
                />

                <FormField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={fieldErrors.password}
                    endAdornment={
                        <button
                            type="button"
                            className="field__toggle"
                            onClick={() => setShowPassword((v) => !v)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    }
                />

                {formError && (
                    <p className="form-error" role="alert">
                        {formError}
                    </p>
                )}

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in…" : "Log in"}
                </button>
            </form>

            <p className="auth-switch">
                New to Forge Athletics? <Link to="/signup">Create an account</Link>
            </p>
        </AuthLayout>
    );
}

export default Login;
