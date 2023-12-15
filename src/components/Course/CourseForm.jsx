import { useState } from 'react';
import defaultImage from '../../assets/download.png';
import { consultentApi } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { showErrorToast, ToastContainer } from '../../helpers/toaster';
import { useNavigate } from 'react-router-dom';
import CustomSelect from './CustomSelect';
import CropperModal from '../StudentHome/CropperModal';
const CourseForm = () => {
  const navigate = useNavigate()
  const { Token, Role } = useSelector((state) => state.User);
  const [img, setImg] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [openCropper, SetOpenCropper] = useState(false)
  const [formData, setFormData] = useState({
    header: '',
    course_image: null,
    short_blob: '',
    students_qualification_header: '',
    qualification_description: '',
    requirements_header: '',
    requirements_blob: '',
    country: '',
    fee: 0,
  });



  const handleSelectedOptionId = (optionId) => {
    setFormData({
      ...formData,
      country: optionId,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      showErrorToast('Select a Valid Image');
      return;
    }
    setImg(file);
    SetOpenCropper(true)
  };

  const handleCroppedImage = ({ image, imageUrl }) => {
    SetOpenCropper(false);

    if (image) {
      setFormData({ ...formData, image: image });
      setImagePreview(imageUrl);
    }

  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (name === 'fee' && (isNaN(value) || Number(value) < 0)) {
      showErrorToast('Fee must be a positive number');
      return;
    }

    setFormData({
      ...formData,
      [name]: type === 'file' ? e.target.files[0] : value,
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.header) {
      showErrorToast('Course header is required');
      return;
    }
    if (!formData.fee || formData.fee === 0 || isNaN(formData.fee)) {
      showErrorToast('Course fee is required');
      return;
    }
    if (!formData.image) {
      showErrorToast('Course Image is required');
      return;
    }
    if (!formData.country) {
      showErrorToast('Course Country is required');
      return;
    }

    consultentApi.post('/create_courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': Token,
        'userRole': Role,
      },
    }).then((response) => {
      console.log(response);
      if (response.data) {
        navigate('/profile')
      }
    })

    console.log('Form Data:', formData);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-white rounded-md shadow-md">
      <nav className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create Course</nav>
      {openCropper && <CropperModal image={img} handleCroppedImage={handleCroppedImage} />}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="mb-4">
          {imagePreview ? (
            <img className="rounded-lg shadow-lg mx-auto w-full max-h-48 md:max-h-full" src={imagePreview} alt="User Profile" />
          ) : (
            <img className="rounded-lg shadow-lg mx-auto w-full max-h-48 md:max-h-full" src={defaultImage} alt="User Profile" />
          )}
        </div>

        <div className="mb-4">

          <label htmlFor="course_image" className="block text-sm font-medium text-gray-600">
            Course Image
          </label>
          <input
            type="file"
            id="course_image"
            name="course_image"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          <CustomSelect onOptionSelect={handleSelectedOptionId} />
        </div>
        <div className="mb-4">
          <label htmlFor="header" className="block text-sm font-medium text-gray-600">
            Course Name
          </label>
          <input
            type="text"
            id="header"
            name="header"
            placeholder="Course Header"
            value={formData.header}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="short_blob" className="block text-sm font-medium text-gray-600">
            Course Description
          </label>
          <textarea
            id="short_blob"
            name="short_blob"
            placeholder="Course Description"
            value={formData.short_blob}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="students_qualification_header" className="block text-sm font-medium text-gray-600">
            Qualification
          </label>
          <input
            type="text"
            id="students_qualification_header"
            name="students_qualification_header"
            placeholder="Qualification"
            value={formData.students_qualification_header}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="qualification_description" className="block text-sm font-medium text-gray-600">
            Qualification Description
          </label>
          <textarea
            id="qualification_description"
            name="qualification_description"
            placeholder="Qualification Description"
            value={formData.qualification_description}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="requirements_header" className="block text-sm font-medium text-gray-600">
            Requirements
          </label>
          <input
            type="text"
            id="requirements_header"
            name="requirements_header"
            placeholder="Requirements Header"
            value={formData.requirements_header}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="requirements_blob" className="block text-sm font-medium text-gray-600">
            Requirements Description
          </label>
          <textarea
            id="requirements_blob"
            name="requirements_blob"
            placeholder="Requirements Description"
            value={formData.requirements_blob}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fee" className="block text-sm font-medium text-gray-600">
            Fee
          </label>
          <input
            type="number"
            id="fee"
            name="fee"
            placeholder="Course Fee"
            value={formData.fee}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="mb-4 flex justify-start">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CourseForm;
