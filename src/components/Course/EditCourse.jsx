import { useState, useEffect } from 'react';
import { baseImageUrl } from '../../config/apiURL';
import defaultImage from '../../assets/download.png';
import { consultentApi } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { showErrorToast, showToast, ToastContainer } from '../../helpers/toaster';
import { useNavigate } from 'react-router-dom';

const EditCourse = ({ courseData }) => {
  const navigate = useNavigate();
  const { Token, Role } = useSelector((state) => state.User);
  const [imgUrl, setImgUrl] = useState(courseData.course_image || '');
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    header: courseData.header || '',
    course_image: null,
    short_blob: courseData.short_blob || '',
    students_qualification_header: courseData.students_qualification_header || '',
    qualification_description: courseData.qualification_description || '',
    requirements_header: courseData.requirements_header || '',
    requirements_blob: courseData.requirements_blob || '',
    fee: courseData.fee || 0,
  });

  useEffect(() => {
    if (courseData.course_image) {
      setImagePreview(baseImageUrl + courseData.course_image);
    }
  }, [courseData.course_image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      showErrorToast('Select a Valid Image');
      return;
    }
    setImgUrl(file);
    formData.image = file;
    setImagePreview(URL.createObjectURL(file));
  };

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

    // Update the course data
    consultentApi
      .post('/update_course', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': Token,
          'userRole': Role,
        },
      })
      .then((response) => {
        if (response.data) {
          navigate('/profile');
        }
      });

    console.log('Form Data:', formData);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-white rounded-md shadow-md">
      <nav className="text-2xl font-semibold text-gray-800 mb-4 text-center">Edit Course</nav>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="mb-4">
          {imagePreview ? (
            <img className="rounded-lg shadow-lg mx-auto w-full max-h-48 md:max-h-full" src={imagePreview} alt="Course" />
          ) : (
            <img className="rounded-lg shadow-lg mx-auto w-full max-h-48 md:max-h-full" src={imgUrl || defaultImage} alt="Course" />
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
        </div>
        <div className="mb-4">
          <label htmlFor="header" className="block text-sm font-medium text-gray-600">
            Header
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
            Short Blob
          </label>
          <textarea
            id="short_blob"
            name="short_blob"
            placeholder="Short Blob"
            value={formData.short_blob}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="students_qualification_header" className="block text-sm font-medium text-gray-600">
            Students Qualification Header
          </label>
          <input
            type="text"
            id="students_qualification_header"
            name="students_qualification_header"
            placeholder="Qualification Header"
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
            Requirements Header
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
            Requirements Blob
          </label>
          <textarea
            id="requirements_blob"
            name="requirements_blob"
            placeholder="Requirements Blob"
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
            Update Course
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditCourse;
