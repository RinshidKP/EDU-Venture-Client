import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminApi } from '../../apiRoutes/studentAPI.js';
import { userLogout } from '../../Redux/Client.js';

function AdminNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const highlight = 'text-amber-300 dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6';
  const normal = 'border-b-2 text-teal-300 border-transparent hover:text-amber-300 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6';

  return (
    <nav className="z-10  bg-gradient-to-bl from-gray-400 to-slate-600 cursor-pointer sticky top-0 shadow dark:bg-gray-800">
      <div className="container flex flex-wrap items-center justify-evenly p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
        <a onClick={() => navigate('/')} className={`w-full sm:w-auto ${pathname === '/' ? highlight : normal}`}>
          Home
        </a>
        <a onClick={() => navigate('/dashboard')} className={`w-full sm:w-auto ${pathname === '/dashboard' ? highlight : normal}`}>
          Dashboard
        </a>
        <a onClick={() => navigate('/dashboard_students')} className={`w-full sm:w-auto ${pathname === '/dashboard_students' ? highlight : normal}`}>
          Students
        </a>
        <a onClick={() => navigate('/dashboard_consultencies')} className={`w-full sm:w-auto ${pathname === '/dashboard_consultencies' ? highlight : normal}`}>
          Consultencies
        </a>
        <a onClick={() => navigate('/dashboard_transactions')} className={`w-full sm:w-auto ${pathname === '/dashboard_transactions' ? highlight : normal}`}>
          Transactions
        </a>
        <a onClick={() => navigate('/dashboard_countries')} className={`w-full sm:w-auto ${pathname === '/dashboard_countries' ? highlight : normal}`}>
            Countries
        </a>
      </div>
    </nav>
  );
}

export default AdminNavBar;
