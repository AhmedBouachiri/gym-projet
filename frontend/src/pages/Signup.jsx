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
            errors.username = "Choose a username.";
        } else if (username.trim().length < 3) {
            errors.username = "Username must be at least 3 characters.";
        }

        if (!email.trim()) {
            errors.email = "Enter your email.";
        } else if (!EMAIL_RE.test(email.trim())) {
            errors.email = "Enter a valid email address.";
        }

        if (!password) {
            errors.password = "Choose a password.";
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters.";
        }

        if (confirmPassword !== password) {
            errors.confirmPassword = "Passwords don't match.";
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
            await api.post("register/", {
                username: username.trim(),
                email: email.trim(),
                password,
            });

            setIsDone(true);
        } catch (error) {
            setFormError(
                getErrorMessage(error, "Signup failed. Please check your details.")
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isDone) {
        return (
            <AuthLayout
                eyebrow="YOU'RE IN"
                title="Account created"
                subtitle="Your Forge Athletics account is ready — log in to get started."
            >
                <button className="btn-primary" onClick={() => navigate("/login")}>
                    Continue to login
                </button>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            eyebrow="GET STARTED"
            title="Create your account"
            subtitle="Join Forge Athletics and start training today."
        >
            <form onSubmit={handleSignup} noValidate>
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
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={fieldErrors.email}
                />

                <FormField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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
                {!fieldErrors.password && (
                    <p className="password-hint">Use at least 8 characters.</p>
                )}

                <FormField
                    label="Confirm password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={fieldErrors.confirmPassword}
                />

                {formError && (
                    <p className="form-error" role="alert">
                        {formError}
                    </p>
                )}

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account…" : "Create account"}
                </button>
            </form>

            <p className="auth-switch">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </AuthLayout>
    );
}

export default Signup;
