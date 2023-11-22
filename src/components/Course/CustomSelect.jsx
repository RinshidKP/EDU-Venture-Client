import { useEffect, useState } from 'react';
import { showErrorToast } from '../../helpers/toaster';
import { consultentApi } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';


const CustomSelect = ({ onOptionSelect }) => {
    const [options,setOptions]= useState([])
    const { Token, Role } = useSelector((state) => state.User);
        useEffect(()=>{
            consultentApi.get('/list_countries',{
            headers: {
                'Authorization': Token,
                'userRole': Role,
            }
            }).then((response)=>{
            setOptions(response.data.countries)
            }).catch((error)=>{
                showErrorToast(error.message)
            })
        })
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onOptionSelect(option._id)
  };

  return (
    <div className="  relative">
      <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Select a Country
      </label>
      <div className="relative inline-block w-full">
        <div
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption ? (
            <div className="flex items-center">
              <img src={selectedOption.image.url} alt={selectedOption.label} className="w-6 h-6 mr-2" />
              {selectedOption.name}
            </div>
          ) : (
            'Choose a country'
          )}
        </div>
        {isOpen && (
          <div className="absolute top-0 left-0 w-full h-48 bg-white border border-gray-300 rounded-lg shadow-md p-2 overflow-auto cursor-pointer" id="custom-dropdown">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center p-2 hover:bg-blue-100"
                onClick={() => handleOptionSelect(option)}
              >
                <img src={option.image.url} alt={option.name} className="w-6 h-6 mr-2" />
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
