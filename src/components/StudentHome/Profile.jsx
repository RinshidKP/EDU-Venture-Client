import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../assets/dummy-profile.jpg';
import defaultPassport from '../../assets/download.png'
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';

const Profile = () => {
  const navigate = useNavigate();
  const studentAxios = useStudentAxiosIntercepter()
  const [userData, setData] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [certificate,setCertificate]= useState({})
  useEffect(() => {
    studentAxios.get('/profile')
      .then((response) => {
        setData(response.data.user);
        setImgUrl(response.data.user.profile_picture || defaultImage);
        setCertificate(response.data.certificates)
      })
      .catch((error) => {
        console.error("Error loading user profile:", error);
      });
  }, []);

  const handleApplicationClick = () => {
    // setApplication(!application);
    navigate('/student_applications')
  }

  const handleBlogClick = () => {
    // setBlog(!blog);
    navigate('/student_blogs', { state: { courses: userData.courses } })
    // console.log(blog);
  }
  const editPassport = ()=>{
    navigate('/edit_passport_details',{state: {passport:certificate?.passport}})
  }

  const editCertificate = ()=>{
    navigate('/edit_certificate_details',{state: {qualification:certificate?.qualification}})
  }
  return (
    <div>
      <nav style={{ backgroundColor: '#F3F8F9' }} className="cursor-pointer dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="border p-1 ">
            <div className="flex items-center justify-center p-6 text-dark-600 capitalize dark:text-gray-300">
              <h1 className='text-2xl'>Profile</h1>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-16">
        <div className="container">
          <div className="bg-white bg-opacity-70 w-full shadow-xl rounded-lg">
            <div className="text-center flex justify-center flex-col">
              <div className='flex justify-center w-full sm:w-3/4 mb-5 py-5 px-5 mx-auto bg-gray-200 shadow-lg flex-col sm:flex-row'>
                <div className="my-auto">
                  <img
                    src={
                      userData.profile_picture?.url
                        ? imgUrl.url
                        : defaultImage
                    }
                    alt="......"
                    className="avatar rounded-full h-60 w-60 border-4 border-white m-5  object-cover object-center"
                  />
                </div>
                <div className='m-5 flex flex-col'>
                  <div className='flex-1'></div>
                  <div className='flex-1 flex flex-col sm:flex-row items-center justify-start'>
                    <span className="mr-2">Name:</span>
                    <h3 className="text-xl leading-normal animate-rotate-x">
                      {userData ? userData.full_name : 'User Name'}
                    </h3>
                  </div>
                  <div className='flex-1 flex flex-col sm:flex-row items-center justify-start'>
                    <span className="mr-2">Age:</span>
                    <h3 className="text-xl leading-normal animate-rotate-x">
                      {userData ? userData?.age : 'User Age'}
                    </h3>
                  </div>
                  <div className='flex-1 flex flex-col sm:flex-row items-center justify-start'>
                    <span className="mr-2">Email:</span>
                    <h5 className='text-xl leading-normal mb-2 animate-rotate-x'>
                      {userData ? userData.email : 'User Email'}
                    </h5>
                    <p className="mb-0 text-red-500">
                      {imgUrl ? null : 'Please Update Your Photo!!'}
                    </p>
                  </div>
                  <div className="user-info flex-1">
                    <button
                      className="bg-sky-300 hover:text-white transition-transform transform hover:scale-110 my-5 hover:bg-sky-700 text-dark font-bold py-2 px-4 rounded"
                      onClick={() => {
                        navigate("/student/edit_profile");
                      }}
                    >
                      Edit info
                    </button>
                  </div>
                </div>
              </div>


              <div className='my-5 select-none w-full flex flex-col sm:flex-row items-center justify-center cursor-pointer'>
                <div className='my-5 select-none w-full flex flex-col sm:flex-row items-center justify-center cursor-pointer'>
                  <div className="text-2xl rounded-lg text-center  w-full sm:w-3/4 border border-green-800">
                    <div className='py-3 bg-white-100'>
                      <h3 className='underline text-green-800 font-semibold'>Passport</h3>
                    </div>
                    <div className='flex justify-center' >
                    <div className='flex m-4 text-start'>
                      {/* First Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Passport Name
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Passport Number
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Date Of Birth
                        </h3>
                      </div>

                      {/* Second Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                        {certificate?.passport?.name||"Passport Name"}
                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                        {certificate?.passport?.passportNumber||"Passport Number"}
                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.passport?.dateOfBirth
                          ? new Date(certificate.passport.dateOfBirth).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          :"Date of birth"}
                        </h3>
                      </div>

                      {/* Third Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Place Of Birth
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Date Of Issue
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Date Of Expirey
                        </h3>
                      </div>

                      {/* Fourth Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                         {certificate?.passport?.placeOfBirth||" Place of birth"}
                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.passport?.dateOfIssue
                          ? new Date(certificate.passport.dateOfIssue).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          :"Date of Issue"}
                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.passport?.dateOfExpiry
                          ? new Date(certificate.passport.dateOfExpiry).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          :"Date of Expirey"}
                        </h3>
                      </div>
                    </div>
                    </div>
                    <div className='m-5 flex justify-center '>
                      <img className='h-40 w-80 border rounded border-sky-800' src={certificate?.passport?.image_proof.url||defaultPassport} alt="" />
                    </div>
                    <div>
                      <button onClick={editPassport} className='border border-black text-green-900 px-2 m-2 rounded-lg hover:bg-gray-800 hover:text-white' >Edit</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='my-5 select-none w-full flex flex-col sm:flex-row items-center justify-center cursor-pointer'>
                <div className='my-5 select-none w-full flex flex-col sm:flex-row items-center justify-center cursor-pointer'>
                  <div className="text-2xl rounded-lg text-center w-full sm:w-3/4 border border-green-800">
                    <div className='py-3 bg-white-100'>
                      <h3 className='underline text-green-800 font-semibold'>Certificates</h3>
                    </div>
                    <div className="flex justify-center">
                    <div className='flex m-4 text-start '>
                      {/* First Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Qualification Name
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          University Name
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Joined Date
                        </h3>
                      </div>

                      {/* Second Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.qualification?.qualificationName||'Name'}
                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.qualification?.universityName||'University Name'}

                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.qualification?.joinedDate?
                           new Date(certificate.qualification.joinedDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        :'Date of Joining'}
                        </h3>
                      </div>

                      {/* Third Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Collage Name
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Collage Address
                        </h3>
                        <h3 className='my-2 font-bold text-gray-700 p-1'>
                          Date Of Passing

                        </h3>
                      </div>

                      {/* Fourth Column */}
                      <div className='text-xl flex flex-col my-2 mx-5'>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.qualification?.collegeName||'College Name'}
                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                          {certificate?.qualification?.collegeAddress||'College Address'}

                        </h3>
                        <h3 className='my-2 rounded-lg border border-sky-500 p-1 text-gray-800'>
                        {certificate?.qualification?.dateOfPassing?
                           new Date(certificate.qualification.dateOfPassing).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        :'Date of Passing'}
                        </h3>
                      </div>
                    </div>
                    </div>
                    <div className='m-5 flex justify-center '>
                      <img className='h-40 w-80 border rounded border-sky-800' src={certificate?.qualification?.image_proof.url||defaultPassport} alt="" />
                    </div>
                    <div>
                      <button onClick={editCertificate} className='border border-black text-green-900 px-2 m-2 rounded-lg hover:bg-gray-800 hover:text-white' >Edit</button>
                    </div>
                  </div>
                </div>
              </div>


              <div className='my-5 select-none flex flex-col sm:flex-row items-center justify-center cursor-pointer'>
                <h3 onClick={handleApplicationClick} className="border text-2xl text-center border-green-800 w-full sm:w-3/4 py-3 bg-white-100">
                  Applications
                </h3>
              </div>
              <div onClick={handleBlogClick} className='my-5 select-none flex flex-col sm:flex-row items-center justify-center cursor-pointer'>
                <h3 className="border text-2xl text-center border-green-800 w-full sm:w-3/4 py-3 bg-white-100">
                  Blogs
                </h3>
              </div>
              <div className='my-5 flex flex-col sm:flex-row items-center justify-center select-none'>
                <h3 className="border text-2xl text-center border-green-800 w-full sm:w-3/4 py-3 bg-white-100">
                  Rewards
                </h3>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>

  );
};

export default Profile;
