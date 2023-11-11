import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { studentAPI } from '../../apiRoutes/studentAPI';
import { baseImageUrl } from '../../config/apiURL';
import defaultImage from '../../assets/dummy-profile.jpg';
import Applications from './Applications';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setData] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const { Email, Token, Role } = useSelector((state) => state.User);
  const [application,setApplication] = useState(false);
  const [review,setReview] = useState(false);
  useEffect(() => {
    studentAPI.get('/profile', {
      // params: { email: Email },
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

  const handleApplicationClick = () => {
    setApplication(!application);
  }

  const handleReviewClick = () => {
    setReview(true);
  }

  return (
    <div>
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
    <div className="container">
      <div className="bg-white bg-opacity-70 w-full shadow-xl rounded-lg">
        <div className="text-center flex justify-center flex-col">
          <div className='flex justify-center w-full sm:w-3/4 mb-5 py-5 px-5 mx-auto bg-gray-200 shadow-lg flex-col sm:flex-row'>
            <div className="my-auto">
              <img
                src={
                  userData.profile_picture
                    ? baseImageUrl + imgUrl
                    : defaultImage
                }
                alt="......"
                className="avatar rounded-full h-60 w-60 border-4 border-white m-5  object-cover object-center"
              />
            </div>
            <div className='m-5 flex flex-col'>
              <div className='flex-1'></div>
              <div className='flex-1 flex flex-col sm:flex-row items-center justify-start'>
                <span className="mr-2">Name:</span>
                <h3 className="text-xl leading-normal animate-rotate-x">
                  {userData ? userData.full_name : 'User Name'}
                </h3>
              </div>
              <div className='flex-1 flex flex-col sm:flex-row items-center justify-start'>
                <span className="mr-2">Age:</span>
                <h3 className="text-xl leading-normal animate-rotate-x">
                  {userData ? userData?.age : 'User Age'}
                </h3>
              </div>
              <div className='flex-1 flex flex-col sm:flex-row items-center justify-start'>
                <span className="mr-2">Email:</span>
                <h5 className='text-xl leading-normal mb-2 animate-rotate-x'>
                  {userData ? userData.email : 'User Email'}
                </h5>
                <p className="mb-0 text-red-500">
                  {imgUrl ? null : 'Please Update Your Photo!!'}
                </p>
              </div>
              <div className="user-info flex-1">
                <button
                  className="bg-sky-300 hover:text-white transition-transform transform hover:scale-110 my-5 hover:bg-sky-700 text-dark font-bold py-2 px-4 rounded"
                  onClick={() => {
                    navigate("/student/edit_profile");
                  }}
                >
                  Edit info
                </button>
              </div>
            </div>
          </div>

          <div className='my-5 select-none flex flex-col sm:flex-row items-center justify-center cursor-pointer'>
            <h3 onClick={handleApplicationClick} className="border text-2xl text-center border-green-800 w-full sm:w-3/4 py-3 bg-white-100">
              Applications
            </h3>
          </div>
          {application&&( <Applications/> )}
          <div className='my-5 flex flex-col sm:flex-row items-center justify-center'>
            <h3 className="border text-2xl text-center border-green-800 w-full sm:w-3/4 py-3 bg-white-100">
              Rewards
            </h3>
          </div>
          <div className='my-5 flex flex-col sm:flex-row items-center justify-center'>
            <h3 onClick={handleReviewClick} className="border text-2xl text-center border-green-800 w-full sm:w-3/4 py-3 bg-white-100">
              Reviews
            </h3>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

  );
};

export default Profile;
