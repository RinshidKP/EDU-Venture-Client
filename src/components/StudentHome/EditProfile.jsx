import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createStudentAPI } from '../../apiRoutes/studentAPI';
import defaultImage from '../../assets/dummy-profile.jpg';
import { baseImageUrl } from '../../config/apiURL';
import { showErrorToast, showToast, ToastContainer } from '../../helpers/toaster';

const EditProfile = () => {
  const studentAPI = createStudentAPI();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [newUser, setNewUser] = useState({});
  const [imagePreview, setImagePreview] = useState(null); 
  const [imgUrl, setImgUrl] = useState(''); 
  const { Email, Token, Role } = useSelector((state) => state.User);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  useEffect(() => {
    studentAPI
      .get('/profile', {
        params: { email: Email },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Token,
          'userRole': Role,
        },
      })
      .then((response) => {
        setUserData(response.data.user);
        setImgUrl(response.data.user.profile_picture);
      })
      .catch((error) => {
        console.error('Error loading user profile:', error);
      });
  }, [Email, Token, Role]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();

  if (!userData.full_name&&newUser.full_name&&!newUser.full_name.trim()) {
    showErrorToast('Full Name is required');
    return;
  }
  if (!userData.age&&newUser.age&isNaN(newUser.age) || newUser.age < 0) {
    showErrorToast('Age must be a non-negative number');
    return;
  }


    studentAPI.post('/update_profile', newUser, {
        headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': Token,
        'userRole': Role,
        },
    }).
    then((response)=>{
        console.log(response)
        navigate('/student_profile')
    })
    .catch((error)=>{
        showErrorToast(error)
    })

};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      showErrorToast('Select a Valid Image');
      return;
    }
    
    if (file && file.size > 10 * 1024 * 1024) {
      showErrorToast('File size is too large. Please select a smaller image.');
      return;
    }

    setImagePreview(URL.createObjectURL(file));

    newUser.image = file ;

    console.log('newUser.image Added and Changed',newUser);
  };

return (
<div className="bg-gray-100 min-h-screen">

  <nav className="bg-blue-200 text-white py-4 text-center">
    <div className="container mx-auto">
      <h1 className="text-2xl">Edit Profile</h1>
    </div>
  </nav>

  <section className="container mx-auto py-8">
    <div className="bg-white shadow-md rounded-lg mx-auto max-w-3xl p-8">
      <form onSubmit={handleUpdateProfile} encType="multipart/form-data">
        <div className="text-center mb-8">
          <label htmlFor="profileImage" className="cursor-pointer block">
            <input type="file" accept="image/*" id="profileImage" className="hidden" onChange={handleImageChange} />
            <div className='flex justify-center'>
        <div className="rounded-full overflow-hidden w-48 h-48 md:w-64 md:h-64">
          <img
            className="object-cover w-full h-full"
            src={imagePreview || (imgUrl ? baseImageUrl + imgUrl : defaultImage)}
            alt="User Profile"
          />
        </div>
      </div>
      
      <div className='flex justify-center my-5'>
          <div className=" relative border mb-4 w-2/6 rounded-md p-2 bg-gray-100">
          <input
            type="file"
            id="course_image"
            name="course_image"
            accept="image/*"
            onChange={() => document.getElementById('profileImage').click()}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="ml-2 text-gray-600">Choose an image</span>
          </div>
        </div>
      </div>
      
          </label>
        </div>
        <div>
          <div className="mb-4">
            <label htmlFor="full_name" className="block text-gray-700 font-semibold">
              Full Name
            </label>
            <input type="text" id="full_name" name="full_name" placeholder={userData.full_name} value={newUser.full_name || '' } onChange={handleInputChange} className="input-text w-full" />

          </div>

          <div className="mb-4">
            <label htmlFor="age" className="block text-gray-700 font-semibold">
              Age
            </label>
            <input type="number" id="age" name="age" min={0} value={newUser.age} onChange={handleInputChange}  placeholder={userData.age>0 ? userData.age : 0} className="input-text w-full" />


          </div>
          <div className="mb-4">
            <label htmlFor="qualification" className="block text-gray-700 font-semibold">
              Qualification
            </label>
            <input type="text" id="qualification" name="qualification" value={newUser.qualification || '' } onChange={handleInputChange} placeholder={userData.qualification||"Qualification"} className="input-text w-full" />

          </div>
          <p className="text-red-500">
            {userData.profile_picture ? null : 'Please Update Your Photo!!'}
          </p>
        </div>
        <div className="text-center mt-8">
          <button type="submit" className="bg-blue-200 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  </section>
  <ToastContainer />
</div>
);
};

export default EditProfile;