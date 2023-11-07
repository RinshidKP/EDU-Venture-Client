import queryString from 'query-string';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { baseImageUrl } from '../../config/apiURL';
import { useNavigate,useLocation } from 'react-router-dom';
import { consultentApi } from '../../apiRoutes/studentAPI';
import { showErrorToast,ToastContainer } from '../../helpers/toaster';
import CustomSelect from './CustomSelect';


const EditCourses = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState('');
  const { Token,Role } = useSelector((state) => state.User);
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [newData, setNewData] = useState({})

  const location = useLocation();
  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    console.log(queryParams);
    setOpened({ ...queryParams, is_active: queryParams.is_active === 'true' });
    setNewData({ ...newData, is_active: queryParams.is_active === 'true' });
    console.log(opened.is_active);
  }, [location.search]);



  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      showErrorToast('Select a Valid Image');
      return;
    }
    newData.image = file
    setImagePreview(URL.createObjectURL(file));
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    newData.id = opened._id
    console.log(newData);
    consultentApi.post('/update_course', newData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': Token,
        'userRole': Role,
      },
    }).then((response) => {
      if (response.status === 200) {
        navigate('/profile')
        setOpen(!open)
        setOpened(!opened)
      }
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'fee' && (isNaN(value) || Number(value) < 0)) {
      showErrorToast('Fee must be a positive number');
      return;
    }

    setNewData({
      ...newData,
      [name]: value,
    });
  }

  const handleSelectedOptionId = (optionId) => {
    setNewData({
      ...newData,
      country:optionId,
    });
  };

  const handleDisable = () => {
    setOpened(prevOpened => {
      return { ...prevOpened, is_active: !prevOpened.is_active };
    });
    setNewData(prevOpened => {
      return { ...prevOpened, is_active: !prevOpened.is_active };
    });
  }

  return (
          <div className="bg-white h-full my-10 md:my-0 rounded-lg p-6 ">
            <nav className='mx-10'>
            <h2 className={`text-3xl font-semibold mb-5 text-center ${!opened.is_active ? 'text-red-500' : ''}`}>
              Edit Course
              </h2>
            </nav>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:flex md:items-center md:justify-center">
                <div className="mx-auto mb-4 pr-2 w-1/2 md:w-auto">
                  {imagePreview ? (
                    <img className="rounded-lg shadow-lg max-h-48 md:max-h-96" src={imagePreview} alt="Course" />
                  ) : (
                    <img className="rounded-lg shadow-lg max-h-48 md:max-h-96" src={baseImageUrl + (opened.course_image || 'defaultImage')} alt="Course" />
                  )}
                </div>
                <div className="w-1/2  md:w-auto">
                  <div className=" relative border mb-4 rounded-md p-2 bg-gray-100">
                    <input
                      type="file"
                      id="course_image"
                      name="course_image"
                      accept="image/*"
                      onChange={handleImageChange}
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
                    {!opened.is_active&& (<p className=' bg-red-500 rounded-lg text-center text-white' >Course Is Disabled</p>) }
                </div>
              </div>
              <div className="md:ml-4">
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2 pr-2">
                    <label htmlFor="header" className="block text-sm font-medium text-gray-600">
                      Header
                    </label>
                    <input
                      type="text"
                      id="header"
                      name="header"
                      placeholder={opened.header}
                      value={newData.header}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pl-2">
                    <label htmlFor="short_blob" className="block text-sm font-medium text-gray-600">
                      Short Blob
                    </label>
                    <textarea
                      id="short_blob"
                      name="short_blob"
                      placeholder={opened.short_blob}
                      value={newData.short_blob}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pr-2">
                    <label htmlFor="students_qualification_header" className="block text-sm font-medium text-gray-600">
                      Students Qualification Header
                    </label>
                    <input
                      type="text"
                      id="students_qualification_header"
                      name="students_qualification_header"
                      placeholder={opened.students_qualification_header}
                      value={newData.students_qualification_header}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pr-2">
                    <label htmlFor="qualification_description" className="block text-sm font-medium text-gray-600">
                      Qualification Description
                    </label>
                    <textarea
                      id="qualification_description"
                      name="qualification_description"
                      placeholder={opened.qualification_description}
                      value={newData.qualification_description}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pr-2">
                    <label htmlFor="requirements_header" className="block text-sm font-medium text-gray-600">
                      Requirements Header
                    </label>
                    <input
                      type="text"
                      id="requirements_header"
                      name="requirements_header"
                      placeholder={opened.requirements_header}
                      value={newData.requirements_header}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pr-2">
                    <label htmlFor="requirements_blob" className="block text-sm font-medium text-gray-600">
                      Requirements Blob
                    </label>
                    <textarea
                      id="requirements_blob"
                      name="requirements_blob"
                      placeholder={opened.requirements_blob}
                      value={newData.requirements_blob}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="w-full md:w-1/2 pr-2">
                    <label htmlFor="fee" className="block text-sm font-medium text-gray-600">
                      Fee
                    </label>
                    <input
                      type="number"
                      id="fee"
                      name="fee"
                      placeholder={opened.fee}
                      value={newData.fee}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="w-full md:w-1/2 ">
                    <CustomSelect onOptionSelect={handleSelectedOptionId}/>
                  </div>
                </div>
              <div className="mt-4">
                <div className="flex flex-col md:flex-row justify-start">
                  <div className="mb-2 md:mb-0">
                    <button
                      type="submit"
                      className="w-full md:w-auto bg-cyan-900 text-white py-2 px-4 rounded-md hover:bg-cyan-500 focus:outline-none"
                    >
                      Update Course
                    </button>
                  </div>
                  <div className="mx-auto">
                  <button
                    type="button"
                    className={`w-full md:w-auto ${!opened.is_active ?'bg-green-500' : 'bg-red-500'} text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none mb-2 md:mb-0 md:mr-2`}
                    onClick={handleDisable}
                  >
                    {!opened.is_active ? 'Enable' : 'Disable'}
                  </button>                    
                  </div>
                </div>
              </div>
              </div>
            </form>
            <ToastContainer/>
          </div>
  )
}

export default EditCourses
