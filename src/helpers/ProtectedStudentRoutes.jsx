import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';

function ProtectedStudentRoutes({ children }) {
const { Token , Role } = useSelector((state) => state.User);
const location = useLocation();
console.log(Token,Role);
return Token && (Role =='student'||Role =='admin') ? (
    children
    ) : (
        <Navigate to="/" state={{ from: location.pathname }} replace />
)
}

export default ProtectedStudentRoutes;