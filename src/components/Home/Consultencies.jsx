import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import defaultImage from '../../assets/download.png'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';

const Consultencies = () => {
  const navigate = useNavigate();
  const [consultents, setConsultents] = useState([]);
  const { Token, Role } = useSelector((state) => state.User);
  const studentAxios = useStudentAxiosIntercepter()
  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows :true ,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
    ]
  };
  
  useEffect(() => {
    studentAxios.get('/list_consultencies')
    .then((response) => {
      setConsultents(response.data.consultents);
      console.log(response.data.consultents);
    })
    .catch((error) => {
      console.error('Error fetching consultents:', error);
    });
  }, [Token, Role]);

  return (
    <div className=" ">
      <div>
      <Slider {...settings} className="my-4 ">
        
        {consultents.map((consultent) => (
          <div key={consultent._id} className="max-w-sm  transition-transform hover:scale-105">
            <div className='mx-2 bg-sky-100 rounded-b-lg' >
            <img className='w-full h-40 object-cover rounded-t-lg' src={consultent.profile_image.url||defaultImage} alt="" />
            <div className='p-5'>
              <h5 className="my-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {consultent.consultancy_name}
              </h5>
              <p className="my-2 group/items font-normal text-gray-700 dark:text-gray-400">
                {consultent.description||'Not Updated'}
              </p>
              <button
                onClick={() => {
                  navigate(`/consultent_details`, { state: { consultent } })
                }}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 group-hover/items:bg-sky-700"
              >
                Read more
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </button>
            </div>
            </div>
          </div>
        ))}
      </Slider>
      </div>
    </div>
  );
};

export default Consultencies;