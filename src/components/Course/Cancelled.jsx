
import { useSelector } from 'react-redux';

const Cancelled = () => {

const {DisplayName}=useSelector((state)=> state.User)

  return (
    <div className="bg-gray-300 h-[54%] flex items-center justify-center">
      {/* Content Start */}
      <div className="max-w-screen-md bg-white  px-8 rounded shadow-md my-10">
        {/* Generic Pod Left Aligned with Price breakdown Start */}
        <div className="border-l-4 border-r-4 border-gray-200 p-4">
          <div className="ml-4">
            <p>
              Hi {DisplayName},
            </p>
          </div>
          <div className="ml-4 mr-4 mt-4">
            <h3>Something Went Wrong Payment Got Cancelled  </h3>
          </div>
        </div>
        {/* Generic Pod Left Aligned with Price breakdown End */}
      </div>
      {/* Content End */}
    </div>
  );
};

export default Cancelled;
