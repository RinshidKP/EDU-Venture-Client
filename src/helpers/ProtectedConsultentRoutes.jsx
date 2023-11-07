import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';

function ProtectedConsultentRoutes({ children }) {
const { Token , Role } = useSelector((state) => state.User);
const location = useLocation();

return Token && Role =='consultent' ? (
    children
    ) : (
        <Navigate to="/" state={{ from: location.pathname }} replace />
)
}

export default ProtectedConsultentRoutes;