import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { studentAPI } from '../../apiRoutes/studentAPI';
import { baseImageUrl } from '../../config/apiURL';
import defaultImage from '../../assets/dummy-profile.jpg';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setData] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const { Email,Token,Role } = useSelector((state) => state.User);

  useEffect(() => {
  studentAPI.get('/profile', {
    params: { email: Email },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': Token,
      'userRole': Role
    }
  })
  .then((response) => {
    setData(response.data.user);
    setImgUrl(response.data.user.profile_picture || defaultImage);
  })
  .catch((error) => {
    console.error("Error loading user profile:", error);
  });
}, []);

  

  return (
    <div >
  
  <nav style={{ backgroundColor: '#F3F8F9' }} className="cursor-pointer dark:bg-gray-800">
    <div className="container mx-auto">
      <div className="border p-1 ">
        <div className="flex items-center justify-center p-6 text-dark-600 capitalize dark:text-gray-300">
            <h1 className='text-2xl'>Profile</h1>
        </div>
      </div>
    </div>
  </nav>


      <section className="pt-16">
        <div className="container mx-auto">
          <div className="bg-white bg-opacity-70 w-full shadow-xl rounded-lg p-6">
            <div className="text-center my-auto">
              <div className="flex justify-center">
                <img
                  src={
                    userData.profile_picture
                      ? baseImageUrl+imgUrl
                      : defaultImage
                  }
                  alt="......"
                  className="avatar rounded-full h-48 w-48 border-4 border-white"
                />
              </div>
              <h3 className="text-xl  leading-normal mb-2">
                    { userData ? userData.full_name: 'User Name'}
              </h3>
              <div className="user-info">
                <h5 className='text-xl  leading-normal mb-2'>
                { userData ? userData.email: 'User Email'}
                </h5>
                <p className="mb-0 text-red-500 ">
                  {imgUrl ? null : "Please Update Your Photo!!"}
                </p>

                <button
                  className="bg-green-300 my-5 hover:bg-green-700 text-dark font-bold py-2 px-4 rounded "
                  onClick={() => {
                    navigate("/student/edit_profile");
                  }}
                >
                  Edit info
                </button>
                <div className=' flex items-center m-10 justify-center'>
                  <h3 className="border text-2xl text-center border-green-800 w-3/4 py-3 bg-white-100">
                  Applications
                  </h3>
                </div>
                <div className=' flex items-center m-10 justify-center'>
                  <h3 className="border text-2xl text-center border-green-800 w-3/4 py-3 bg-white-100">
                    Rewards
                  </h3>
                </div>
                <div className=' flex items-center m-10 justify-center'>
                  <h3 className="border text-2xl text-center border-green-800 w-3/4 py-3 bg-white-100">
                    Write Blog
                  </h3>
                </div>
              </div>
              <div className="input-group mb-3 w-75 mx-auto">

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
