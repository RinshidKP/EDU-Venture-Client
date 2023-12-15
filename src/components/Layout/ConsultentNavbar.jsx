import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../Redux/Client';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { consultentApi } from '../../apiRoutes/studentAPI';

const ConsultentNavbar = () => {

  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [unread, setUnread] = useState(false);
  const [count, setCount] = useState(false);
  const { Token, Role, Id } = useSelector((state) => state.User)
  const socket = io('https://eduventure.live', {
    transports: ['websocket'],
    query: { userId: Id },
  });

  socket.on('message', (message) => {
    console.log('Received message:', message, unread);
    setUnread(unread + 1);
    setCount(true);
  });

  useEffect(() => {
    if (Role === '') {
      consultentApi.get('/unread_messages', {
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
  }, [Role, Token, Id])

  const high = 'text-cyan-900 dark:text-geen-600 border-b-2 border-blue-500 mx-1.5 sm:mx-6';
  const norm = 'border-b-2 border-transparent text-dark hover:text-cyan-900 dark:hover-text-gray-200 hover-border-blue-500 mx-1.5 sm:mx-6';


  const showAdvancedAlert = () => {
    Swal.fire({
      title: 'Do You Wish To Logout',
      text: 'Do you Wish to leave',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Leave',
      cancelButtonText: 'Stay',
      customClass: {
        confirmButton: ' bg-red-500 text-white rounded-md px-4 py-2 mx-2',
        cancelButton: ' bg-green-700 text-white rounded-md px-4 py-2 mx-2',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(userLogout())
        // Swal.fire('You clicked OK!', '', 'error ');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('You Choose To Stay!', '', 'success');
      }
    });
  };

  return (

    <>

      <nav className=" z-10 h-auto cursor-pointer bg-gradient-to-r from-cyan-600 to-cyan-700 sticky top-0 shadow dark:bg-gray-800">
        <div className="container  mx-auto">
          <div className=" shadow-sm"> {/* Add border and padding here */}
            <div className="flex items-center justify-center p-6 text-dark-600 capitalize dark:text-gray-300">
              <div className="flex flex-1 justify-center ">
                <a onClick={() => navigate('/consultent')} className={` ${pathname === '/consultent' ? high : norm}`}>
                  Home
                </a>
              </div>
              <div className="flex flex-1 justify-center">
                <a onClick={() => { navigate('/profile') }} className={` ${pathname === '/profile' ? high : norm}`}>
                  Profile
                </a>
              </div>
              <div className="flex flex-1 justify-center">
                <a onClick={() => { navigate('/consultent_student') }} className={` ${pathname === '/consultent_student' ? high : norm}`}>
                  Student
                </a>
              </div>
              <div className="flex flex-1 justify-center">
                <a onClick={() => { navigate('/consultent_chat') }} className={` ${pathname === '/consultent_chat' ? high : norm}`}>
                  <FontAwesomeIcon className='text-teal-200' icon={faComment} /> {unread && Role === 'consultent' && (
                    <span className='bg-red-400  p-1 text-sm border border-white rounded-full'>
                      {unread}
                    </span>
                  )}
                </a>
              </div>
              <FaSignInAlt onClick={
                showAdvancedAlert}
                size={20} className={pathname === '/blogs' ? high : norm} />
            </div>
          </div>
        </div>
      </nav>


    </>

  );
};

export default ConsultentNavbar;