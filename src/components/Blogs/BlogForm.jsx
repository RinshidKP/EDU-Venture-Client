import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, showErrorToast, showToast } from '../../helpers/toaster';
import { useNavigate } from 'react-router-dom';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';

const BlogForm = () => {
    const [image, setImage] = useState(false);
    const navigate = useNavigate()  
    const studentAxios = useStudentAxiosIntercepter();
    const { Id } = useSelector((state) => state.User);
    const [blog, setBlog] = useState({
        heading: '',
        image: null,
        description: '',
        creator:Id,
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validateForm()) {
            return;
        }
        studentAxios.post('/create_blog', blog, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response)=>{
            console.log(response.status);
            if(response.status===200){
                showToast(response.data.message);
                navigate('/student_profile')
            }
        }).catch((error)=>{
            console.log(error.response.data);
            showErrorToast(error.response.data.message)
        })
    }
    const isImage = (file) => {
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const fileNameParts = file.name.split('.');
        const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
        return allowedExtensions.includes(fileExtension);
    };
    const handleImageChange = (e) => {
        e.preventDefault()
        const selectedImage = e.target.files[0];

        if (selectedImage && isImage(selectedImage)) {
            const imageUrl = URL.createObjectURL(selectedImage);
            setBlog({ ...blog, image: selectedImage });
            setImage(imageUrl);
        } else {
            showErrorToast('Invalid image type. Please choose an image file.');
            setImage(null);
        }
    };
    const validateForm = () => {
        if (!blog.heading.trim()) {
            showErrorToast('Please enter a Blog Heading.');
            return false;
        }

        if (!blog.description.trim()) {
            showErrorToast('Please enter a Blog Description.');
            return false;
        }

        if (!blog.image) {
            showErrorToast('Please select an image for the Blog.');
            return false;
        }

        return true;
    };
    return (
        <div className="flex max-w-2xl mx-auto">
            {/* Left side for image display */}
            <div className="flex-shrink-0 flex justify-center items-center w-1/3 p-8 bg-gray-100">
                {image ? (
                    <div className="relative rounded overflow-hidden">
                        <img
                            src={image}
                            alt="Selected Image"
                            className="w-full h-auto rounded"
                        />
                        <div onClick={() => { setImage(false), setBlog({ ...blog, image: null }) }} className="cursor-pointer absolute text-sm top-0 right-0 bg-transparent hover:bg-white text-gray-700 p-2 rounded-full">
                            X
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <span className="text-4xl">&#x1F4F7;</span> {/* Camera Emoji */}
                        <p className="text-lg mt-4">No image selected</p>
                    </div>
                )}
            </div>


            {/* Right side for the form */}
            <div className="bg-white p-8 lg:p-12 rounded-md w-2/3 max-w-2xl shadow-md">
                <h2 className="text-3xl lg:text-4xl font-semibold mb-6 text-gray-800">Create a Blog</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="heading" className="mb-2 text-lg block text-gray-700">
                            Blog Heading
                        </label>
                        <input
                            type="text"
                            id="heading"
                            value={blog.heading}
                            onChange={(e) => setBlog({ ...blog, heading: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded text-base focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="mb-2 text-lg block text-gray-700">
                            Blog Description
                        </label>
                        <textarea
                            id="description"
                            value={blog.description}
                            onChange={(e) => setBlog({ ...blog, description: e.target.value })}
                            className="w-full h-24 p-2 border border-gray-300 rounded text-base resize-none focus:outline-none focus:ring focus:border-blue-500"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="image" className="mb-2 text-lg block text-gray-700">
                            Blog Image (optional):
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 rounded p-2 text-base focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 text-lg focus:outline-none focus:ring focus:border-blue-500"
                    >
                        Submit
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>

    );
};

export default BlogForm;
