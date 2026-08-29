import { Navigate } from "react-router-dom";

function RequireAuth({ children }) {
    const access = localStorage.getItem("access");
    
    if (!access) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

export default RequireAuth;
