import "./AuthLayout.css";

function PlateMark() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
            <path
                d="M12 2.5 3 7v10l9 4.5 9-4.5V7l-9-4.5Zm0 2.2 6.6 3.3L12 11.3 5.4 8l6.6-3.3Zm-7 4.5 6 3v6.7l-6-3V9.2Zm8 9.7v-6.7l6-3v6.7l-6 3Z"
                fill="currentColor"
            />
        </svg>
    );
}

function AuthLayout({ eyebrow, title, subtitle, children }) {
    return (
        <div className="auth-shell">
            <aside className="auth-brand">
                <div className="auth-brand__stripe" aria-hidden="true" />

                <div className="auth-brand__top">
                    <div className="auth-brand__logo">
                        <PlateMark />
                        <span>GESTION GYM</span>
                    </div>
                </div>

                <div className="auth-brand__mid">
                    <p className="auth-brand__eyebrow">{eyebrow}</p>

                    <h1 className="auth-brand__headline">
                        ENTRAÎNEZ-VOUS.
                        <br />
                        PROGRESSEZ.
                        <br />
                        DÉPASSEZ-VOUS.
                    </h1>

                    <p className="auth-brand__sub">{subtitle}</p>
                </div>

                <div className="auth-brand__stat">
                    <span className="auth-brand__stat-number">24/7</span>
                    <span className="auth-brand__stat-label">
                        Votre espace accessible à tout moment
                    </span>
                </div>
            </aside>

            <main className="auth-form-side">
                <div className="auth-card">
                    <div className="auth-card__logo--mobile">
                        <PlateMark />
                        <span>GESTION GYM</span>
                    </div>

                    <p className="auth-card__eyebrow">{eyebrow}</p>
                    <h2 className="auth-card__title">{title}</h2>
                    {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AuthLayout;