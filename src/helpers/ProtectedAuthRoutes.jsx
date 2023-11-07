import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';

function ProtectedAuthRoutes({ children }) {
const { Token } = useSelector((state) => state.User);
const location = useLocation();
// console.log(Token);
return Token ? (
    <Navigate to="/" state={{ from: location.pathname }} replace />
    ) : (
    children
)
}

export default ProtectedAuthRoutes;