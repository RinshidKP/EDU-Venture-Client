import {useState,useEffect} from 'react'
import defaultImage from '../../assets/download.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useConsultantInterceptor } from '../../customHooks/useConsultantInterceptor';

const Profile = () => {

  const [user,setUser]= useState()
  const { Email } = useSelector((state) => state.User);
  const [imgUrl, setImgUrl] = useState('');
  const navigate = useNavigate();
  const consultantAxios = useConsultantInterceptor();

   
    useEffect(()=>{
      consultantAxios
      .get('/profile', {
          params: { email: Email },
        })
        .then((response) => {
          setUser(response.data.user);
          setImgUrl(response.data.user.profile_image.url);
        })
        .catch((error) => {
          console.error("Error loading user profile:", error);
        });
      }, []);
return (
<div>

  <div className='flex items-center mt-10'>
    <div className='w-1/2 flex justify-center md:my-10'>
      <div className='h-auto md:w-2/4 flex w-auto m-5 items-center justify-center my-auto'>
        <img className='rounded-lg h-auto  shadow-lg' src={imgUrl ? imgUrl: defaultImage} alt='User Profile' />
      </div>
    </div>
    <div className='h-full w-1/2  flex flex-col md:my-10'>
      <div className='flex items-center md:text-start justify-start'>
        <h3 className=' text-xl md:text-4xl lg:text-4xl text-center mt-10 text-dark'>
          {user ? user?.consultancy_name : 'Consultancy Name'}
        </h3>
      </div>
      <div className=' '>
        <div className='max-w-md'>
          <p className=' text-sm lg:text-base xl:text-lg 2xl:text-xl text-start text-dark '>
            Description : {user ? user?.description : ' an Indian firm whose goal is to support students in their future'}
          </p>
        </div>
        <div  className='flex items-center mx-10 my-5 justify-end'>
          <button onClick={(()=>navigate('edit_profile'))} className="button text-white bg-cyan-800 py-2 px-6 rounded-lg">
            <FontAwesomeIcon  icon={faPen} className="icon " /> <span className='text-white'>Edit Info</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div className=' flex items-center mx-5 my-7 justify-center'>
    <h3 className="border text-2xl text-center rounded mt-10  border-gray-300 shadow-lg w-3/4 py-3 bg-white-100">
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