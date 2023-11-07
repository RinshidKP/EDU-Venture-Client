import React, { useState } from 'react';
import { adminApi } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { ToastContainer, showErrorToast, showToast } from '../../helpers/toaster';

const AddCountryModal = ({ open,setCountries, onClose }) => {
    if (!open) return null;

    const [selectedImage, setSelectedImage] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const { Token, Role } = useSelector((state) => state.User);

    const [image, setImage] = useState(null);

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const image = new Image();
                image.src = e.target.result;
                image.onload = () => {
                    const canvas = document.createElement("canvas");
                    const maxWidth = 800;
                    const maxHeight = 600;
                    let newWidth, newHeight;

                    if (image.width > maxWidth || image.height > maxHeight) {
                        if (image.width / maxWidth > image.height / maxHeight) {
                            newWidth = maxWidth;
                            newHeight = (image.height * maxWidth) / image.width;
                        } else {
                            newHeight = maxHeight;
                            newWidth = (image.width * maxHeight) / image.height;
                        }
                    } else {
                        newWidth = image.width;
                        newHeight = image.height;
                    }

                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, newWidth, newHeight);

                    canvas.toBlob((blob) => {
                        const resizedFile = new File([blob], file.name, { type: file.type });
                        setImage(resizedFile);
                    }, file.type);
                    const resizedDataUrl = canvas.toDataURL("image/jpeg");

                    setSelectedImage(resizedDataUrl);
                };
            };
            reader.readAsDataURL(file);
        }
    };


    const clearSelectedImage = () => {
        setSelectedImage(null);
    };

    const createCountry = (e) => {
        e.preventDefault();
        const newCountryData = {
            image: image,
            name: name,
            description: description,
        };

        adminApi
            .post('/add_contries', newCountryData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': Token,
                    'userRole': Role,
                },
            })
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
                showErrorToast(error.message)
            });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-overlay absolute inset-0 bg-black opacity-50"></div>

            <div className="modal-container h-[90%] bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-xl z-50 overflow-hidden">
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
                                    onClick={clearSelectedImage}
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
                                onChange={handleImageSelect}
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

    );
};

export default AddCountryModal;
