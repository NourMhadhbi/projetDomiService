import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("CC_Token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default PrivateRoute;
