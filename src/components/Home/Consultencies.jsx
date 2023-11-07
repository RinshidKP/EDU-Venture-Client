import { useEffect, useState } from 'react';
import { studentAPI } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { baseImageUrl } from '../../config/apiURL';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';


const Consultencies = () => {
  const navigate = useNavigate()
  const [consultents, setConsultents] = useState([]);
  const { Token, Role } = useSelector((state) => state.User);
  useEffect(() => {
    studentAPI.get('/list_consultencies',
    {headers: {
      'Authorization': Token,
      'userRole': Role,
    }},)
      .then((response) => {
        setConsultents(response.data.consultents);
        // console.log(response.data.consultents);
      })
      .catch((error) => {
        console.error('Error fetching consultents:', error);
      });
  }, []);

  return (
    <div className="w-full flex flex-wrap justify-evenly ">
    {consultents.map((consultent) => (
      <div key={consultent._id} className="mx-2 my-20 w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
        <a >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {consultent.consultancy_name}
          </h5>
        </a>
        <img src={baseImageUrl+consultent.profile_image} alt="" />
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {consultent.short_blob}
        </p>
        <a onClick={()=>{
          // const consultent = queryString.stringify(consultent)
          navigate(`/consultent_details?${queryString.stringify(consultent)}`)
          }}  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Read more
          <svg className="w-3.5 h-3.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </a>
      </div>
    ))}
  </div>
  );
};

export default Consultencies;