import { useEffect, useRef, useState } from "react";
import "./AuthLayout.css";

function useCountUp(target, durationMs = 1400) {
    const [value, setValue] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        const start = performance.now();
        let frame;

        const tick = (now) => {
            const progress = Math.min((now - start) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, durationMs]);

    return value;
}

function PlateMark() {
    return (
        <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden="true">
            <circle cx="24" cy="24" r="23" fill="var(--charcoal)" stroke="var(--line)" />
            <circle cx="24" cy="24" r="16" fill="none" stroke="var(--ember)" strokeWidth="4" />
            <circle cx="24" cy="24" r="5.5" fill="var(--ember)" />
        </svg>
    );
}

/**
 * Shared split-screen shell for the Login and Signup pages.
 * Left: brand panel. Right: the form passed in as children.
 */
function AuthLayout({ eyebrow, title, subtitle, children }) {
    const members = useCountUp(12480);

    return (
        <div className="auth-shell">
            <aside className="auth-brand">
                <div className="auth-brand__stripe" aria-hidden="true" />

                <div className="auth-brand__top">
                    <div className="auth-brand__logo">
                        <PlateMark />
                        <span>FORGE ATHLETICS</span>
                    </div>
                </div>

                <div className="auth-brand__mid">
                    <p className="auth-brand__eyebrow">MEMBER ACCESS</p>
                    <h1 className="auth-brand__headline">
                        SHOW UP.
                        <br />
                        LIFT MORE.
                        <br />
                        REPEAT.
                    </h1>
                    <p className="auth-brand__sub">
                        Book classes, track your sessions, and manage your membership
                        in one place.
                    </p>
                </div>

                <div className="auth-brand__stat">
                    <span className="auth-brand__stat-number">
                        {members.toLocaleString()}+
                    </span>
                    <span className="auth-brand__stat-label">members training with us</span>
                </div>
            </aside>

            <main className="auth-form-side">
                <div className="auth-card">
                    <div className="auth-card__logo auth-card__logo--mobile">
                        <PlateMark />
                        <span>FORGE ATHLETICS</span>
                    </div>

                    {eyebrow && <p className="auth-card__eyebrow">{eyebrow}</p>}
                    <h2 className="auth-card__title">{title}</h2>
                    {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}

                    {children}
                </div>
            </main>
        </div>
    );
}

export default AuthLayout;
