import { Navigate } from "react-router-dom";

const ProtectedRoute = ({component: Component, ...rest}: any) => {
    const token = localStorage.getItem('echobot-jwt');

    return (
        token ? <Component {...rest} /> : <Navigate to="/login" />
    );
}
 

export default ProtectedRoute;