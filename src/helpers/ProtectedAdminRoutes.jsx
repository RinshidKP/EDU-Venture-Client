import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';

function ProtectedAdminRoutes({ children }) {
const { Token , Role } = useSelector((state) => state.User);
const location = useLocation();

return Token && Role =='admin' ? (
    children
    ) : (
        <Navigate to="/" state={{ from: location.pathname }} replace />
)
}

export default ProtectedAdminRoutes;