import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await api.get("dashboard/stats/");
            setStats(response.data);
        } catch (err) {
            const msg = getErrorMessage(err, "Impossible de charger les statistiques.");
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Tableau de Bord</h1>
                    <p className="page-subtitle">Aperçu de votre salle de sport</p>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {!loading && stats && (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-content">
                                <p className="stat-label">Membres inscrits</p>
                                <p className="stat-value">{stats.members_total}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">✓</div>
                            <div className="stat-content">
                                <p className="stat-label">Membres actifs</p>
                                <p className="stat-value">{stats.members_active}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">🎟️</div>
                            <div className="stat-content">
                                <p className="stat-label">Abonnements actifs</p>
                                <p className="stat-value">{stats.subscriptions_active}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">⏰</div>
                            <div className="stat-content">
                                <p className="stat-label">À renouveler (7 jours)</p>
                                <p className="stat-value">{stats.subscriptions_expiring}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">👔</div>
                            <div className="stat-content">
                                <p className="stat-label">Employés</p>
                                <p className="stat-value">{stats.employees_total}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">✓</div>
                            <div className="stat-content">
                                <p className="stat-label">Employés actifs</p>
                                <p className="stat-value">{stats.employees_active}</p>
                            </div>
                        </div>
                    </div>

                    <div className="quick-actions">
                        <h2>Accès rapide</h2>
                        <div className="action-buttons">
                            <button
                                className="action-button"
                                onClick={() => handleNavigate("/admin/members")}
                            >
                                <span className="action-icon">👥</span>
                                <span className="action-text">Gérer les membres</span>
                            </button>
                            <button
                                className="action-button"
                                onClick={() => handleNavigate("/admin/subscriptions")}
                            >
                                <span className="action-icon">🎟️</span>
                                <span className="action-text">Gérer les abonnements</span>
                            </button>
                            <button
                                className="action-button"
                                onClick={() => handleNavigate("/admin/employees")}
                            >
                                <span className="action-icon">👔</span>
                                <span className="action-text">Gérer les employés</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {loading && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Chargement du tableau de bord...</p>
                </div>
            )}
        </div>
    );
}

export default Dashboard;

