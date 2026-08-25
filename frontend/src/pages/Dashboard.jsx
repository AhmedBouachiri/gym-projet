import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
    };

    return (
        <div className="dashboard">
            <div className="dashboard__card">
                <p className="auth-card__eyebrow">MEMBER DASHBOARD</p>
                <h2 className="dashboard__title">You're logged in.</h2>
                <p className="dashboard__body">
                    This is a placeholder home screen — wire up your real dashboard
                    here (bookings, membership status, workout history, etc).
                </p>
                <button className="btn-primary" onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
