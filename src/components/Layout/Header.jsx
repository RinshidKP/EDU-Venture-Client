import { useLocation, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../Redux/Client';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { studentAPI } from '../../apiRoutes/studentAPI';

const Header = () => {
  const dispatch = useDispatch();
  const { Token, Role, Id } = useSelector((state) => state.User);
  const location = useLocation();
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = location.pathname;
  const [count, setCount] = useState(false);
  const [unread, setUnread] = useState(false);
  const highlited =
    'text-cyan-300 select-none dark:text-green-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6';
  const normal =
    'border-b-2 select-none border-transparent text-gray-200 hover:text-cyan-300 dark:hover-text-gray-200 hover-border-blue-500 mx-1.5 sm:mx-6';

  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    query: { userId: Id },
  });

  socket.on('message', (message) => {
    console.log('Received message:', message);
    setUnread(unread + 1);
    setCount(true);
  });

  useEffect(() => {
    if (Role === 'student' || Role === 'admin') {
      studentAPI.get('/unread_messages', {
        params: {
          id: Id,
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Token,
          'userRole': Role
        }
      }).then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setUnread(response.data.unread)
        }
      }).catch((error) => {
        console.log(error)
      })
    } 
  }, [Id, Role, Token])
  return (
    <nav
      className="cursor-pointer backdrop-filter backdrop-blur-lg sticky top-0 bg-sky-950 opacity-95 shadow dark:bg-gray-800 z-10 flex justify-evenly"
    >
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between p-6 text-dark-600 capitalize dark:text-gray-300">
          <div className="flex items-center">
            {/* Hamburger menu icon */}
            <div className="sm:hidden ml-2">
              {isMobileMenuOpen ? (
                <FaTimes size={24} onClick={() => setIsMobileMenuOpen(false)} />
              ) : (
                <FaBars size={24} onClick={() => setIsMobileMenuOpen(true)} />
              )}
            </div>
            <a onClick={() => navigate('/')} className={pathname === '/' ? highlited : normal}>
              Home
            </a>
          </div>
          {/* Mobile menu for smaller screens */}
          <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} flex items-center`}>
            <a onClick={() => navigate('/student_profile')} className={pathname === '/student_profile' ? highlited : normal}>
              Profile
            </a>
            <a onClick={() => navigate('/student_consultents')} className={pathname === '/student_consultents' ? highlited : normal}>
              Consultencies
            </a>
            <a onClick={() => navigate('/student_countries')} className={pathname === '/student_countries' ? highlited : normal}>
              Countries
            </a>
            <a onClick={() => navigate('/student_courses')} className={pathname === '/student_courses' ? highlited : normal}>
              Courses
            </a>
            <a onClick={() => navigate('/blogs')} className={pathname === '/blogs' ? highlited : normal}>
              Blogs
            </a>
            <a onClick={() => navigate('/student_chat')} className={pathname === '/student_chat' ? highlited : normal}>

              <FontAwesomeIcon icon={faComment} /> {unread && Role !== 'consultent' && (
                <span className='bg-red-600 text-sm border border-white rounded-full'>
                  {unread}
                </span>
              )}

            </a>
          </div>
          {/* FaSignInAlt icon for mobile view */}
          <div className="flex items-center sm:hidden">
            <div size={10} className="w-10 ml-2">
              <FaSignInAlt
                size={20}
                className={pathname === '/blogs' ? highlited : normal}
                onClick={() => setShowOptions(!showOptions)}
              />
            </div>
          </div>
          {/* Desktop navigation for larger screens */}
          <div className="hidden sm:flex items-center">
            <a onClick={() => navigate('/student_profile')} className={pathname === '/student_profile' ? highlited : normal}>
              Profile
            </a>
            <a onClick={() => navigate('/student_consultents')} className={pathname === '/student_consultents' ? highlited : normal}>
              Consultencies
            </a>
            <a onClick={() => navigate('/student_countries')} className={pathname === '/student_countries' ? highlited : normal}>
              Countries
            </a>
            <a onClick={() => navigate('/student_courses')} className={pathname === '/student_courses' ? highlited : normal}>
              Courses
            </a>
            <a onClick={() => navigate('/blogs')} className={pathname === '/blogs' ? highlited : normal}>
              Blogs
            </a>
            {Role === 'consultent'?'':(<a onClick={() => navigate('/student_chat')} className={pathname === '/student_chat' ? highlited : normal}>

              <FontAwesomeIcon icon={faComment} /> {unread ? <span className='bg-red-600 text-sm border border-white rounded-full'>{unread}</span> : ''}
            </a>)}
            {/* FaSignInAlt icon for desktop view */}
            <div size={10} className="w-10 ml-2 select-none">
              <FaSignInAlt
                size={20}
                className={normal}
                onClick={() => setShowOptions(!showOptions)}
              />
            </div>
          </div>
          {/* Options for user (login, logout, etc.) */}
          <div className="flex items-center">
            {Token ? (
              showOptions ? (
                <div className="absolute top-10 right-10 p-2 bg-white shadow-md w-30 rounded-md">
                  <ul className="list-none">
                    {Role === 'consultent' && (
                      <li className="mb-2">
                        <a
                          onClick={() => navigate('/consultent')}
                          className="p-2 border-b border-gray-300 text-black hover:underline"
                        >
                          Consultent
                        </a>
                      </li>
                    )}
                    {Role === 'admin' && (
                      <li className="mb-2">
                        <a
                          onClick={() => navigate('/dashboard')}
                          className="p-2 border-b border-gray-300 text-black hover:underline"
                        >
                          Dashboard
                        </a>
                      </li>
                    )}
                    <li className="mb-2">
                      <a
                        onClick={() => dispatch(userLogout())}
                        className="p-2 border-b border-gray-300 text-black hover:underline"
                      >
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              ) : null
            ) : showOptions ? (
              <div className="absolute top-10 right-10 p-2 bg-white shadow-md w-30 rounded-md">
                <ul className="list-none">
                  <li className="mb-2">
                    <a
                      onClick={() => navigate('/login')}
                      className="p-2 border-b border-gray-300 text-black hover:underline"
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => navigate('/signup')}
                      className="p-2 border-b border-gray-300 text-black hover:underline"
                    >
                      Sign Up
                    </a>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
