import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, showErrorToast, showToast } from '../../helpers/toaster';
import CropperModal from '../StudentHome/CropperModal';
import { useAdminAxiosInterceptor } from '../../customHooks/useAdminAxiosInterceptor';

const AddCountryModal = ({ open,setCountries, onClose }) => {
    if (!open) return null;

    const adminAxios = useAdminAxiosInterceptor();

    const [selectedImage, setSelectedImage] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [openCropper,setOpenCropper] = useState(false)

    const validateImage = (e) =>{
        const file = e.target.files[0];
        if (file && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          showErrorToast('Select a Valid Image');
          return;
        }
        setImage(file)
        setOpenCropper(true)
    }

      const handleCroppedImage = ({ image, imageUrl }) => {
        setOpenCropper(false);
        if (image) {
            console.log(image);
          setCroppedImage(image)
          setSelectedImage(imageUrl);
        }
      }

    const createCountry = (e) => {
        e.preventDefault();

        if (!name || !description) {
            showErrorToast('Name and description are required.');
            return;
        }

        if (!image ) {
            showErrorToast('Image is required');
            return;
          }


        const newCountryData = {
            image: croppedImage,
            name: name,
            description: description,
        };
        console.log(newCountryData);

        adminAxios
            .post('/add_contries', newCountryData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            } )
            .then((response) => {

                if (response.status === 200) {
                    console.log(response);
                    showToast(response.data.message);
                    setCountries(response.data.newCountry)
                    onClose();
                } else if (response.status === 409) {
                    // Conflict: 409 Conflict (Duplicate Data)
                    showErrorToast('The resource you are trying to create already exists.');
                } else {
                    // Handle other status codes here
                    console.log(response);
                    showErrorToast(response.data.message);
                }
            })
            .catch((error) => {
                console.error(error);
                showErrorToast(error.response.data.message)
            });
    };

    return (
        <div className='w-full'>
            <div className={`fixed inset-0 flex items-center justify-center z-50 `}>
                <div className="modal-overlay absolute inset-0 bg-black opacity-50"></div>

                <div className={`modal-container h-[90%] bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-xl z-50 overflow-hidden ${openCropper ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex justify-between items-center bg-blue-300 py-2 px-6 rounded-t-lg">
                        <h1 className="text-2xl font-semibold text-gray-700">Add Country</h1>
                        <div onClick={onClose} className="cursor-pointer text-gray-700 text-2xl">×</div>
                    </div>

                    <form encType="multipart/form-data" className="modal-content p-6" onSubmit={createCountry}>
                        <div className="flex items-center justify-center mb-6">
                            <label
                                htmlFor="imageInput"
                                className="w-32 h-32 flex items-center justify-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover-text-white"
                            >
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt="Country Image"
                                        className="h-24 w-24 object-cover"
                                        onChange={validateImage}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center hover:hidden">
                                        <svg
                                            className="w-8 h-8 mb-2 "
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0.38-.04.74-.12 1.1"
                                            />
                                        </svg>
                                        <span className="mt-2 text-sm leading-normal">Select a file</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    id="imageInput"
                                    onChange={validateImage}
                                />
                            </label>
                        </div>

                        <div className="mb-2">
                            <label htmlFor="countryName" className="block text-gray-600 font-semibold mb-2 text-sm">
                                Country Name
                            </label>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                id="countryName"
                                className="w-full p-1 border rounded focus:outline-none focus:border-blue-300 text-sm"
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="countryDescription" className="block text-gray-600 font-semibold mb-2 text-sm">
                                Country Description
                            </label>
                            <textarea
                                onChange={(e) => setDescription(e.target.value)}
                                id="countryDescription"
                                className="w-full p-1 border rounded focus:outline-none focus:border-blue-300 text-sm"
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="flex justify-center">
                            <button className="bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring focus:ring-green-300 text-sm">
                                Add
                            </button>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
                {openCropper&& 
            (<div className=''>
                <CropperModal cropType={'flag'} image={image} handleCroppedImage={handleCroppedImage} />
            </div>)
                }
        </div>

    );
};

export default AddCountryModal;
