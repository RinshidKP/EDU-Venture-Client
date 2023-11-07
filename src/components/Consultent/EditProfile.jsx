import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { baseImageUrl } from '../../config/apiURL';
import defaultImage from '../../assets/download.png';
import { consultentApi } from '../../apiRoutes/studentAPI';
import { showErrorToast, showToast, ToastContainer } from '../../helpers/toaster';

const EditProfile = () => {

const [editedUser, setEditedUser] = useState({});
const [newUser, setNewUser] = useState({});
const { Email, Token, Role } = useSelector((state) => state.User);
const [selectedImage, setSelectedImage] = useState(null);
const [imgUrl, setImgUrl] = useState('');
const [imagePreview, setImagePreview] = useState(null);
const [fileInputText, setFileInputText] = useState('Choose an Image');
const [countries, setCountries] = useState();

const navigate = useNavigate();

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
        ...newUser,
        [name]: value,
    });
};
const handleCountriesChange = (e) => {
    setCountries(e.target.value)    
}



const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        showErrorToast('Select a Valid Image'); 
    return;
    }
    setSelectedImage(file);
    newUser.image = file;
    setImagePreview(URL.createObjectURL(file));
    setFileInputText(file.name);
};

const handleSave = (e) => {
    e.preventDefault();
    newUser.countries = countries
    consultentApi.post('/update_profile', newUser, {
        headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': Token,
        'userRole': Role,
        },
    })
      .then(()=>{
        navigate('/profile')
      })
      .catch((error)=>{
        showErrorToast(error)
      })
};

useEffect(() => {
    consultentApi
        .get('/profile', {
            params: { email: Email },
            headers: {
            'Content-Type': 'application/json',
            'Authorization': Token,
            'userRole': Role,
            },
        })
        .then((response) => {
            setImgUrl(response.data.user.profile_image );
            setEditedUser(response.data.user);
            showToast(response.data.message)
        })
        .catch((error) => {
            console.error('Error loading user profile:', error);
        });
    }, [Email, Token, Role]
);

const initialCountriesValue = ()=>{
    return newUser?.countries
    ? newUser.countries.map((country) => country + ', ').join('')
    : editedUser.countries || 'Countries';
}



return (
<div className="bg-gray-100 h-full p-4 md:p-8 lg:p-12 xl:p-16 2xl:p-20 ">
  <form className='h-full' encType="multipart/form-data">
    <div className="flex h-full flex-col md:flex-row items-center mt-6 space-y-4 md:space-y-0">
      <div className='flex w-1/2 justify-center'>
        <div className="w-full h-full md:w-1/2 p-4">
          {imagePreview ? (
          <img className="rounded-lg shadow-lg mx-auto w-full max-h-48 md:max-h-full" src={imagePreview} alt="User Profile" />
          ) : (
          <img className="rounded-lg shadow-lg mx-auto w-full max-h-48 md:max-h-full" src={imgUrl ? baseImageUrl+imgUrl : defaultImage} alt="User Profile" />
          )}
          <label className="block mt-2 text-center cursor-pointer">
            <span className="btn-primary cursor-pointer block">{fileInputText}</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <div className="text-center mt-2">
            <button onClick={handleSave} className="px-2 py-1 bg-teal-500 rounded text-white hover:bg-teal-600">
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-auto md:w-1/2">
        <div className="border-b-2 border-gray-300 pb-2 mb-4">
          <h3 className="text-2xl text-dark mt-4">
            <input type="text" name="consultancy_name" value={newUser.consultancy_name ? newUser.consultancy_name : editedUser.consultancy_name || '' } onChange={handleInputChange} placeholder="Consultancy Name" className="input-text w-full md:w-4/5" />
          </h3>
          <p className="text-xl text-dark mt-4">
            <span className='flex'>
              Title:
            </span>
            <input type="text" name="title" value={newUser.title ? newUser.title : editedUser.title || '' } onChange={handleInputChange} placeholder="Title" className="input-text w-full md:w-4/5" />
          </p>
          <p className="text-xl text-dark mt-4">
            <span className='flex'>
              Focused On <span>: add , to separate countries</span>
            </span>

            <input type="text" name="countries" value={countries ? countries : initialCountriesValue} onChange={handleCountriesChange} placeholder={initialCountriesValue} className="input-text w-full md:w-4/5" />
          </p>

        </div>
        <div className="mt-4">
          <p className="text-dark text-lg">
            <span className='flex '>
              Description:
            </span>
            <textarea name="description" value={newUser.description ? newUser.description : editedUser.description || '' } onChange={handleInputChange} placeholder="Description" className="input-text  w-full md:w-4/5" />
          </p>
        </div>
      </div>
    </div>
  </form>
  <ToastContainer />
</div>
);
};

export default EditProfile;