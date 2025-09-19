import routes from '@src/router/index.js';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ role, allowedRoles, children, }) => {
    if (!allowedRoles.includes(role)) {
        return <Navigate to={routes.notFound} />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
