import React, { useEffect, useState } from 'react'
import defaultPassport from '../../assets/download.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { showErrorToast } from '../../helpers/toaster';
import CropperModal from './CropperModal';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';
import { useSelector } from 'react-redux';

const EditCertificate = () => {
    const location = useLocation()
    const navigate=useNavigate()
    const [qualification, setQualification] = useState({})
    const [editedQualification, setEditedQualification] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fileInputText, setFileInputText] = useState('Choose an Image');
    const [open, setOpen] = useState(false)
    const [image,setImage] = useState(false)
    const {Id} = useSelector((state)=>state.User)
    const studentAxios = useStudentAxiosIntercepter()

    useEffect(() => {
      if(location?.state?.qualification){
        setQualification(location.state.qualification)
        if(location.state.qualification.image_proof){
          setImagePreview(location.state.qualification.image_proof.url)
      }
      }
    }, [location])
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedQualification((editedQualification) => ({
            ...editedQualification,
            [name]: value,
        }));
    };

    const handleSave = (e) => {
        e.preventDefault()

        console.log(editedQualification);
  

        const data = {
          editedQualification:editedQualification||{},
            studentId: Id,
        }
        if(image){
            data.image=image
        }
        studentAxios.post(
            '/qualification_changes',
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
              console.error('Error during qualification_changes post:', error);
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
                                <img className="rounded-lg shadow-lg mx-auto w-full max-h-48 md:max-h-full" src={editedQualification?.image_proof ? editedQualification.image_proof.url : defaultPassport} alt="User Profile" />
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
                                    name="qualificationName"
                                    onChange={handleInputChange}
                                    placeholder={qualification.qualificationName || 'Name in Certificate'}
                                    className="input-text w-full md:w-4/5 px-2 rounded-lg border border-gray-400 focus:outline-none focus:border-teal-500"
                                />
                            </h3>
                            <p className="text-xl text-dark mt-4">
                                <input
                                    type="text"
                                    name="universityName"
                                    placeholder={qualification.universityName||'Name of university'}
                                    onChange={handleInputChange}
                                    className="input-text w-full md:w-4/5 px-2 rounded-lg border border-gray-400 focus:outline-none focus:border-teal-500"
                                />
                            </p>
                            <p className="text-xl text-dark mt-4">
                                <span className='mx-2 text-xl text-gray-700'>
                                    Date Of Joining
                                </span>
                                <br />
                                <input
                                    type="date"
                                    name="joinedDate"
                                    placeholder={qualification.joinedDate||''}
                                    onChange={handleInputChange}
                                    className="input-text w-full md:w-4/5 px-2 rounded-lg border border-gray-400 focus:outline-none focus:border-teal-500"
                                />
                            </p>
                            <p className="text-xl text-dark mt-4">
                                <input
                                    type="text"
                                    name="collegeName"
                                    placeholder={qualification.collegeName||'Collage Name'}
                                    onChange={handleInputChange}
                                    className="input-text w-full md:w-4/5 px-2 rounded-lg border border-gray-400 focus:outline-none focus:border-teal-500"
                                />
                            </p>
                            <p className="text-xl text-dark mt-2">
                                <textarea
                                    name="collegeAddress"
                                    placeholder={qualification.collegeAddress||'collegeAddress'}
                                    onChange={handleInputChange}
                                    className="input-text w-full md:w-4/5 px-2 rounded-lg border border-gray-400 focus:outline-none focus:border-teal-500"
                                />
                            </p>
                            <p className="text-xl text-dark mt-2">
                                <span className='mx-2 text-xl text-gray-700'>
                                    Date Of Passout
                                </span>
                                <br />
                                <input
                                    type="date"
                                    name="dateOfPassing"
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

export default EditCertificate;

