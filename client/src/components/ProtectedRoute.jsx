import { Navigate } from "react-router";


export function ProtectedRoute({user, children}) {
    if (!user) {
        return <Navigate to="/login"></Navigate>
    }
    return children;
}

export default ProtectedRoute;