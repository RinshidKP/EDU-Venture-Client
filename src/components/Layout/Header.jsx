import { useLocation,useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { useState } from 'react';
import { useDispatch ,useSelector } from 'react-redux';
import { userLogout } from '../../Redux/Client';

const Header = () => {
const dispatch = useDispatch()
const { Token,Role } = useSelector((state)=>state.User);
const location = useLocation();
const navigate = useNavigate();
const [showOptions,SetShowOptions] = useState(false)
const pathname = location.pathname;
const highlited = 'text-green-300 dark:text-geen-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6';
const normal = 'border-b-2 border-transparent hover:text-green-300 dark:hover-text-gray-200 hover-border-blue-500 mx-1.5 sm:mx-6';



return (
<nav style={{backgroundColor:'#5c7062'}} className=" cursor-pointer sticky top-0 shadow dark:bg-gray-800">
  <div className="container mx-auto">
    <div className="flex items-center justify-center p-6 text-dark-600 capitalize dark:text-gray-300">
      <a onClick={()=> {navigate('/')}} className={pathname === '/' ? highlited : normal}>
        Home
      </a>
      <a onClick={()=> {navigate('/student_profile')}} className={pathname === '/student_profile' ? highlited : normal}>
        Profile
      </a>
      <a onClick={()=> {navigate('/student_consultents')}} className={pathname === '/student_consultents' ? highlited : normal}>
        Consultencies
      </a>
      <a onClick={()=> {navigate('/student_countries')}} className={pathname === '/student_countries' ? highlited : normal}>
        Countries
      </a>
      <a onClick={()=> {navigate('/student_courses')}} className={pathname === '/student_courses' ? highlited : normal}>
        Courses
      </a>
      <a onClick={()=> {}} className={pathname === '/blogs' ? highlited : normal}>
        Blogs
      </a>
      {/* <a onClick={()=> {navigate('/student_chat')}} className={pathname === '/student_chat' ? highlited : normal}>
        Chat
      </a> */}
      <div size={10} className="w-40">
        <FaSignInAlt size={20} className={pathname==='/blogs' ? highlited : normal} onClick={()=>SetShowOptions(!showOptions)} />
          {Token ? (
            showOptions ?
          <div className="absolute top-10 right-10 p-2 bg-white shadow-md w-30 rounded-md">
            <ul className="list-none">
              {Role==='consultent'&&(<li className="mb-2">
                <a onClick={()=> navigate('/consultent')}
                  className="p-2 border-b border-gray-300 text-black hover:underline"
                  >
                  Consultent
                </a>
              </li>)}
              {Role==='admin'&&(<li className="mb-2">
                <a onClick={()=> navigate('/dashboard')}
                  className="p-2 border-b border-gray-300 text-black hover:underline"
                  >
                  Dashboard
                </a>
              </li>)}
              <li className="mb-2">
                <a onClick={()=> dispatch(userLogout())}
                  className="p-2 border-b border-gray-300 text-black hover:underline"
                  >
                  Logout
                </a>
              </li>
            </ul>
          </div>
          : null
          ) : showOptions ? (
          <div className="absolute top-10 right-10 p-2 bg-white shadow-md w-30 rounded-md">
            <ul className="list-none">
              <li className="mb-2">
                <a onClick={()=> navigate('/login')}
                  className="p-2 border-b border-gray-300 text-black hover:underline"
                  >
                  Login
                </a>
              </li>
              <li>
                <a onClick={()=> navigate('/signup')}
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