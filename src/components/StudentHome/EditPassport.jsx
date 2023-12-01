import React, { useEffect, useState } from 'react'
import defaultPassport from '../../assets/download.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { showErrorToast } from '../../helpers/toaster';
import CropperModal from './CropperModal';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';
import { useSelector } from 'react-redux';

const EditPassport = () => {
    const location = useLocation()
    const navigate=useNavigate()
    const [passport, setPassport] = useState({})
    const [editedPassport, setEditedPassport] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fileInputText, setFileInputText] = useState('Choose an Image');
    const [open, setOpen] = useState(false)
    const [image,setImage] = useState()
    const {Id} = useSelector((state)=>state.User)

    const studentAxios = useStudentAxiosIntercepter()

    useEffect(() => {
        setPassport(location.state.passport)
        if(location.state.passport.image_proof){
            setImagePreview(location.state.passport.image_proof.url)
        }
    }, [location])
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPassport((editedPassport) => ({
            ...editedPassport,
            [name]: value,
        }));
    };

    const handleSave = (e) => {
        e.preventDefault()

        console.log(editedPassport);

        if (editedPassport.passportNumber&&editedPassport.passportNumber?.length !== 8) {
            showErrorToast('Passport number must be at least 8 characters.');
          }
          
          if (editedPassport.name&&editedPassport.name.trim() === '') {
          showErrorToast('Passport name should be valid.');
          return;
          }
          if (editedPassport.placeOfBirth&&editedPassport.placeOfBirth.trim() === '') {
          showErrorToast('Place of Birth should be valid.');
          return;
          }
        if(editedPassport.dateOfBirth){
            const dateOfBirth = new Date(editedPassport.dateOfBirth);
        const currentDate = new Date();
      
        if (isNaN(dateOfBirth.getTime())) {
          showErrorToast('Invalid date of birth. Please enter a valid date.');
          return;
        }
      
        const minValidAge = 18;
        const minValidDate = new Date();
        minValidDate.setFullYear(currentDate.getFullYear() - minValidAge);
      
        if (dateOfBirth > minValidDate) {
          showErrorToast(`Must be at least ${minValidAge} years old.`);
          return;
        }
        }

        const data = {
            editedPassport,
            studentId: Id,
        }
        if(image){
            data.image=image
        }
        studentAxios.post(
            '/passport_changes',
            data,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
            },
            }
          )
            .then((response) => {
              if (response.status === 200) {
                navigate('/student_profile');
              }
            })
            .catch((error) => {
              console.error('Error during passport_changes post:', error);
            });
          
        
    };


    const validateImage = (e) => {
        e.preventDefault()
        const file = e.target.files[0];
        if (file && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            showErrorToast('Select a Valid Image');
            return false;
        }
        setSelectedImage(file);
        setOpen(true);
        return true
    };


    const handleImageChange = ({ image, imageUrl }) => {
        setOpen(false);

        if (image) {
            setImage(image);
            setImagePreview(imageUrl);
            setFileInputText(image.name);
        }
    }
    return (
        <div className="bg-gray-100 h-full p-4 md:p-8 lg:p-12 xl:p-16 2xl:p-20 ">
            {open && <CropperModal image={selectedImage} handleCroppedImage={handleImageChange} />}
            <form className='h-full' encType="multipart/form-data">
                <div className="flex h-full flex-col md:flex-row items-center mt-7 space-y-4 md:space-y-0">
                    <div className='flex w-1/2 justify-center'>
                        <div className="w-full h-full md:w-1/2 p-4">
                            {imagePreview ? (
                                <img onClick={validateImage} className="rounded-lg shadow-lg mx-auto w-full max-h-48 md:max-h-full" src={imagePreview} alt="User Profile" />
                            ) : (
                                <img className="rounded-lg shadow-lg mx-auto w-full max-h-48 md:max-h-full" src={editedPassport.image_proof ? editedPassport.image_proof.url : defaultPassport} alt="User Profile" />
                            )}
                            <label className="block mt-2 text-center cursor-pointer">
                                <span className="btn-primary cursor-pointer block">{fileInputText}</span>
                                <input type="file" accept="image/*" onChange={validateImage} className="hidden" />
                            </label>
                            <div className="text-center mt-2">
                                <button onClick={handleSave} className="px-2 py-1 bg-teal-500 rounded text-white hover:bg-teal-600">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-auto md:w-1/2">
                        <div className=" pb-2 mb-1">
                            <h3 className="text-2xl text-dark mt-4">
                                <input
                                    type="text"
                                    name="name"
                                    onChange={handleInputChange}
                                    placeholder={passport.name || 'Name in Passport'}
                                    className="input-text w-full md:w-4/5 px-2 rounded-lg border border-gray-400 focus:outline-none focus:border-teal-500"
                                />
                            </h3>
                            <p className="text-xl text-dark mt-4">
                                <input
                                    type="text"
                                    name="passportNumber"
                                    placeholder={passport.passportNumber||'Passport Number'}
                                    onChange={handleInputChange}
                                    className="input-text w-full md:w-4/5 px-2 rounded-lg border border-gray-400 focus:outline-none focus:border-teal-500"
                                />
                            </p>
                            <p className="text-xl text-dark mt-4">
                                <span className='mx-2 text-xl text-gray-700'>
                                    Date Of Birth
                                </span>
                                <br />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    placeholder={passport.dateOfBirth||''}
                                    onChange={handleInputChange}
                                    className="input-text w-full md:w-4/5 px-2 rounded-lg border border-gray-400 focus:outline-none focus:border-teal-500"
                                />
                            </p>
                            <p className="text-xl text-dark mt-4">
                                <input
                                    type="text"
                                    name="placeOfBirth"
                                    placeholder={passport.placeOfBirth||' Place of birth in Passport'}
                                    onChange={handleInputChange}
                                    className="input-text w-full md:w-4/5 px-2 rounded-lg border border-gray-400 focus:outline-none focus:border-teal-500"
                                />
                            </p>
                            <p className="text-xl text-dark mt-2">
                                <span className='mx-2 text-xl text-gray-700'>
                                    Date Of issue
                                </span>
                                <br />
                                <input
                                    type="date"
                                    name="dateOfIssue"
                                    onChange={handleInputChange}
                                    className="input-text w-full md:w-4/5 px-2 rounded-lg border border-gray-400 focus:outline-none focus:border-teal-500"
                                />
                            </p>
                            <p className="text-xl text-dark mt-2">
                                <span className='mx-2 text-xl text-gray-700'>
                                    Date Of Expiry
                                </span>
                                <br />
                                <input
                                    type="date"
                                    name="dateOfExpiry"
                                    onChange={handleInputChange}
                                    className="input-text w-full md:w-4/5 px-2 rounded-lg border border-gray-400 focus:outline-none focus:border-teal-500"
                                />
                            </p>
                        </div>
                    </div>
                </div>
            </form>

            <ToastContainer />
        </div>

    );
};

export default EditPassport;

