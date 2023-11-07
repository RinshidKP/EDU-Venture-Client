import {useState,useEffect} from 'react'
import { consultentApi } from '../../apiRoutes/studentAPI'
import defaultImage from '../../assets/download.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { baseImageUrl } from '../../config/apiURL';

const Profile = () => {

  const [user,setUser]= useState()
  const { Email,Token,Role } = useSelector((state) => state.User);
  const [imgUrl, setImgUrl] = useState('');
  const navigate = useNavigate()
   
    useEffect(()=>{
        consultentApi.get('/profile', {
          params: { email: Email },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Token,
            'userRole': Role
          }
        })
        .then((response) => {
          setUser(response.data.user);
          setImgUrl(response.data.user.profile_image);
        })
        .catch((error) => {
          console.error("Error loading user profile:", error);
        });
      }, []);
return (
<div>

  <div className='flex items-center mt-10'>
    <div className='w-1/2 flex justify-center'>

    <div className='h-auto w-2/4 flex items-center justify-center my-auto'>
      <img className='rounded-lg shadow-lg' src={imgUrl ? baseImageUrl+imgUrl: defaultImage} alt='User Profile' />
    </div>
    </div>
    <div className='h-full w-1/2  flex flex-col'>
      <div className='flex items-center justify-start'>
        <h3 className='text-4xl text-center mt-10 text-dark'>
          {user ? user?.consultancy_name : 'Consultancy Name'}
        </h3>
      </div>
      {user?.countries ? (
        <p className="text-xl text-dark mt-4">
          <span className="flex">
            Focused On: {user.countries.map((country) => country + ', ')}
          </span>
        </p>
      ) : (
        <p className="text-xl text-dark mt-4">
          <span className="flex">Focused On: Countries</span>
        </p>
      )}

      <div className=' '>
        <div className='max-w-md '>
          <p className=' text-sm lg:text-base xl:text-lg 2xl:text-xl text-start text-dark mt-5'>
            Description : {user ? user?.description : ' an Indian firm whose goal is to support students in their future'}
          </p>
        </div>
        <div  className='flex items-center m-10 justify-end'>
          <button onClick={(()=>navigate('edit_profile'))} className="button bg-cyan-800 py-2 px-6 rounded-lg">
            <FontAwesomeIcon  icon={faPen} className="icon " /> <span className='text-white'>Edit Info</span>
          </button>
        </div>
      </div>


    </div>
  </div>
  <div className=' flex items-center mx-5 my-7 justify-center'>
    <h3 className="border text-2xl text-center border-green-800 w-3/4 py-3 bg-white-100">
      Our Courses
    </h3>
  </div>
  <div className=' flex items-center mx-10 justify-end cursor-pointer'>
    <button onClick={(()=>navigate('/profile/create_course'))} className="button bg-cyan-800 py-2 px-6 rounded-lg ">
      <FontAwesomeIcon  icon={faPen} className="icon " /> <span className='text-white'> Add</span>
    </button>
  </div>
</div>

)
}

export default Profile