import { useState } from 'react';
import buildingSvg from '../../assets/building-silhouette-png-20.png';
import ConsultentForm from './ConsultentForm';

const RightSide = () => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div>
      {/* Right Side (Logo) */}
      <div className="bg-emerald-800 flex flex-col justify-center items-center h-screen">
          <div>
            <h1 className="text-3xl text-emerald-950">Edu-Venture</h1>
          </div>
        {isClicked ? (
          <ConsultentForm  />
        ) : (
          <>

        <div>
          <img src={buildingSvg} alt="Building" className="w-full h-auto object-cover md:ml-20" />
        </div>
        
        </>

          )}
        <p className="text-center text-2xl font-semibold mt-4">
        <p className="text-sm text-gray-200 font-sans tracking-widest">
          Join us as a consultant. Click below.
        </p>

          <span
            onClick={() => setIsClicked(!isClicked)}
            className="text-green-500 underline cursor-pointer hover:no-underline transition duration-300"
          >
            Join Us
          </span>{' '}
          in Achieving Our Goals
        </p>
      </div>
    </div>
  );
};

export default RightSide;
