import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'
import HomeCourses from '../../components/Home/HomeCourses'
import Consultencies from '../../components/Home/Consultencies'
import CountriesList from '../../components/Countries/CountriesList'
import { useLottie } from "lottie-react";
import animationData from '../../components/lotties/FloatingStudent.json';
import { ChevronsDown } from 'lucide-react';
const StudentHomePage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  const { View } = useLottie(defaultOptions);
  return (
    <div className="bg-stone-50 ">

      <Header />

      <div className="">
        <div className="flex flex-col-reverse md:flex-row my-5">
          <div className="p-8 md:p-14 relative h-full w-full md:w-2/3">
            <div className='text-start my-14'>
              <h1 className="text-4xl md:text-7xl font-roboto decoration-wavy my-2">Study abroad - your adventure starts here</h1>
              <h1 className="text-lg md:text-2xl font-roboto ">Popular study abroad Partners</h1>
            </div>
            <div className='flex justify-end'>
              <div className='mx-auto '>
                <div className='text-center'>
                  <div className='text-center'>
                    <h2 className=' font-semibold '>See Our Services</h2>
                  </div>
                  <div className='mx-7 my-2 animate-bounce animate-infinite animate-duration-[2000ms]'>
                    <ChevronsDown size={48} strokeWidth={0.5} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className='w-full mx-0 md:w-1/3'>
            {View}
          </div>

        </div>
      </div>

      <div className='mx-24' >

          <div className='text-center my-5'>
            <h1 className='text-4xl'>Our Consultants</h1>
          </div>
        <div className='rounded-lg py-10 ' >
          <Consultencies />
        </div>

        <div className='m-14 flex justify-center '>
          <h1 className='text-3xl'>Popular Choice of Courses</h1>
          <hr ></hr>
        </div>

        <div className="mb-4 rounded-lg py-10">

          <HomeCourses />

        </div>
        <div className="mb-4 rounded-lg py-10 ">

          <CountriesList />

        </div>

      </div>

      <Footer />

    </div>
  )
}

export default StudentHomePage
