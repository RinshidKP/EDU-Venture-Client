import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookReader } from "@fortawesome/free-solid-svg-icons";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { useStudentAxiosIntercepter } from "../../customHooks/useStudentAxiosIntercepter";

const ListAllCourses = () => {
    const navigate = useNavigate();
    const studentAxios = useStudentAxiosIntercepter()
    const coursesPerPage = 9;
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [courses, setCourses] = useState([]);
    const [totalCoursesCount, setTotalCoursesCount] = useState(0);
    const [showCountries, setShowCountries] = useState(false);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [countries, setCountries] = useState([]);
    const [listboxValue, setListboxValue] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([
        { value: "country", label: "Country", sort: "asc" },
        { value: "courseName", label: "Course Name", sort: "asc" },
    ]);

    const [sortCountryOption, setSortCountryOptionOption] = useState(false);
    const [sortDateOption, setSortDateOptionOption] = useState(false);

    const handleFilterClick = () => {
        setShowCountries(!showCountries);
    };


    const handleCountryChange = (selectedOptions) => {
        setListboxValue(selectedOptions);

        const selectedOptionIds = selectedOptions.map((country) => country._id);
        setSelectedOptions((prevSelectedOptions) => [
            ...new Set([...prevSelectedOptions, ...selectedOptionIds]),
        ]);
    };

    useEffect(() => {
        studentAxios
            .get("/view_courses", {
                params: {
                    page: currentPage,
                    limit: coursesPerPage,
                    search: search,
                    filter:
                        listboxValue.length > 0
                            ? listboxValue.map((country) => country._id)
                            : undefined,
                    sortCountry: sortCountryOption === true ? -1 : 1,
                    sortDate: sortDateOption === true ? -1 : 1,
                },
            })
            .then((response) => {
                console.log(response.data);
                setCourses(response.data.courses);
                setTotalCoursesCount(response.data.totalCoursesCount);
                setCountries(response.data.countries);
                setSelectedCountries(listboxValue);
                setSelectedOptions(listboxValue.map((country) => country._id));
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
            });
    }, [currentPage, listboxValue, search, sortCountryOption, sortDateOption]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < Math.ceil(totalCoursesCount / coursesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="container mx-auto ">
            <div className="flex flex-col bg-gray-200 md:flex-row w-full py-4 justify-around items-center">
                <div className=" w-1/3  md:mx-0 ">
                    <form className="w-full my-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="search"
                                onChange={(e) => setSearch(e.target.value)}
                                id="default-search"
                                className="block w-full px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter Keyword to Search..."
                                required
                            />
                        </div>
                    </form>
                </div>


                <div className="flex justify-around my-2" >
                    <div
                        onClick={handleFilterClick}
                        className=" select-none border cursor-pointer bg-white px-3 mx-2 flex justify-evenly rounded items-center text-center border-black w-auto"
                    >
                        <Filter size={20} strokeWidth={1} />
                    </div>
                    <div className="w-full flex md:w-auto">
                        <div className="flex my-2" >
                            <button onClick={() => setSortCountryOptionOption((sortCountryOption) => !sortCountryOption)}
                                className="select-none border cursor-pointer bg-white px-3 mx-2 flex justify-evenly rounded items-center text-center border-black w-auto" >Countries
                                {sortCountryOption ? (
                                    <SortAsc size={20} strokeWidth={1} />
                                ) : (
                                    <SortDesc size={20} strokeWidth={1} />
                                )}
                            </button>
                        </div>
                        {/* <div className="flex my-3" >
                            <button onClick={() => setSortDateOptionOption((sortDateOption) => !sortDateOption)}
                                className="flex px-2 border rounded mx-1" >Date
                                {sortDateOption ? (
                                    <SortAsc size={20} strokeWidth={1} />
                                ) : (
                                    <SortDesc size={20} strokeWidth={1} />
                                )}
                            </button>
                        </div> */}
                    </div>
                </div>

            </div>

            <div className="w-full flex md:justify-center">
                {showCountries && showCountries && (
                    <div className="mt-4 md:mt-0 md:ml-4 px-2 mx-2  py-4 w-auto border border-gray-300 rounded-lg bg-gray-50">
                        <div className="m-2 w-auto">
                            <p className="font-bold mb-2 md:text-xl text-sm">
                                <span className="text-clip">Select Countries:</span>
                            </p>
                            <span
                                onClick={() => handleCountryChange([])}
                                className="cursor-pointer hover:bg-slate-200 rounded-lg px-1 select-none"
                            >
                                Clear filter
                            </span>
                        </div>

                        <Listbox value={listboxValue} onChange={handleCountryChange} multiple>
                            {({ open }) => (
                                <>
                                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus:ring focus:border-blue-300 sm:text-sm">
                                        <span className="block truncate">
                                            {selectedCountries
                                                ? selectedCountries.map((country) => country.name).join(", ")
                                                : "Select countries"}
                                        </span>
                                    </Listbox.Button>
                                    <Listbox.Options className="absolute z-10 w-1/6  py-1 mt-1 overflow-auto text-base bg-white border border-gray-300 rounded-md shadow-md max-h-60 focus:outline-none sm:text-sm">
                                        {countries.map((country) => (
                                            <Listbox.Option key={country._id} value={country}>
                                                {({ selected }) => (
                                                    <div
                                                        className={`${selectedOptions.includes(country._id)
                                                            ? "text-white bg-blue-500"
                                                            : "text-gray-900 hover:bg-gray-200"
                                                            } cursor-default select-none relative py-2 pl-10 pr-4`}
                                                    >
                                                        {country.name}
                                                    </div>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </>
                            )}
                        </Listbox>
                    </div>
                )}
            </div>
            <div className="w-full flex flex-wrap justify-center mb-10">
                {courses ? (
                    courses.map((course) => (
                        <div
                            key={course._id}
                            className="m-5 transition-transform duration-500 ease-in-out hover:scale-110 sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <h5
                                        className={`mb-2 capitalize  font-semibold tracking-wide text-lg ${!course.is_active ? "text-red-600" : "text-gray-900"
                                            } font-bold tracking-tight dark:text-white`}
                                    >
                                        {course.header}
                                    </h5>
                                </div>
                                <div className="flex ">
                                    <h2 className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        {course.countryInfo?.name}
                                    </h2>
                                    <img
                                        className=" mx-1 rounded-full object-cover object-center h-5 w-5"
                                        src={course.countryInfo?.image.url}
                                        alt=""
                                    />
                                </div>
                            </div>
                            <img
                                className="object-cover object-center"
                                src={course.course_image.url}
                                alt=""
                            />
                            <p className="my-1 font-normal line-clamp-2 text-gray-700 dark:text-gray-400">
                                {course.short_blob}
                            </p>
                            <div className="flex justify-between">
                                <h2 className="my-1 font-normal text-gray-700 dark:text-gray-400">
                                    Provided By : {course.creator.consultancy_name}
                                </h2>
                            </div>
                            <div className="flex justify-evenly ">
                                <a
                                    onClick={() => {
                                        navigate(`/course_details`, { state: { course: course } });
                                    }}
                                    className="inline-flex group items-center px-3 py-2 text-sm font-medium text-center transition-width hover:w-full duration-500 ease-in-out text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span>Read more</span>
                                        <svg
                                            className="w-3.5 h-3.5 ml-2"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M1 5h12m0 0L9 1m4 4L9 9"
                                            />
                                        </svg>
                                        <FontAwesomeIcon
                                            icon={faBookReader}
                                            className="text-white opacity-0 group-hover:opacity-100"
                                        />
                                    </div>
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <h1 className="text-6xl text-gray-400 font-sans"> No Courses </h1>
                    </div>
                )}
            </div>
            <div className="flex justify-center my-15">
                <ul className="flex list-none">
                    {Array.from({ length: Math.ceil(totalCoursesCount / coursesPerPage) }, (_, i) => i + 1).map((pageNumber) => (
                        <li key={pageNumber}>
                            <button
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-4 py-2 ml-2 border ${currentPage === pageNumber
                                    ? "bg-blue-700 text-white"
                                    : "bg-white text-blue-700"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={handlePrevClick}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ml-2 border ${currentPage === 1
                        ? "bg-gray-400 text-white"
                        : "bg-blue-700 text-white"
                        }`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNextClick}
                    disabled={currentPage >= Math.ceil(totalCoursesCount / coursesPerPage)}
                    className={`px-4 py-2 ml-2 border ${currentPage >= Math.ceil(totalCoursesCount / coursesPerPage)
                        ? "bg-gray-400 text-white"
                        : "bg-blue-700 text-white"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ListAllCourses;
