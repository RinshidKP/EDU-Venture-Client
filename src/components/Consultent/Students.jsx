import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useConsultantInterceptor } from '../../customHooks/useConsultantInterceptor';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Filter, FilterIcon, FilterX } from 'lucide-react';
const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationPerPage, setApplicationPerPage] = useState(5);
  const [totalApplication, setTotalApplication] = useState(0);
  const consultantAxios = useConsultantInterceptor();
  const [datefilter, setDateFilter] = useState(true)

  const studentStatusOptions = [
    { name: 'Student Status', value: null },
    { name: 'Accepted', value: 'Accepted' },
    { name: 'Rejected', value: 'Rejected' },
    { name: 'Pending', value: 'Pending' },
    { name: 'Reapplied', value: 'Reapplied' },
  ]

  const studentPaymentOptions = [
    { name: 'Payment Status', value: null },
    { name: 'Pending', value: 'Pending' },
    { name: 'Initiated', value: 'Initiated' },
    { name: 'Success', value: 'Paid' },
    { name: 'Failed', value: 'Failed' },
  ]

  const [selectedStudentStatus, setSelectedStudentStatus] = useState(studentStatusOptions[0])
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(studentPaymentOptions[0])

  useEffect(() => {
    consultantAxios.get('/students_consultent', {
      params: {
        page: currentPage,
        limit: applicationPerPage,
        search: search,
        date: datefilter ? 1 : -1,
        status: selectedStudentStatus.value,
        payment: selectedPaymentStatus.value
      }
    })
      .then((response) => {
        console.log(response);
        setStudents(response.data.applications)
        setTotalApplication(response.data.totalApplicationsCount)
      }).catch((error) => {
        console.log(error);
      })
  }, [currentPage, applicationPerPage, search, datefilter, selectedStudentStatus, selectedPaymentStatus])

  const handleClick = (data) => {
    navigate(`/view_student_profile`, { state: data })
  }


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < Math.ceil(totalApplication / applicationPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <nav className='bg-slate-300 py-2 my-2'>
        <div className='flex container mx-auto w-full select-none'>
          <div className='w-2/5'>
            <form className="mx-2">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-6 text-gray-500 dark:text-gray-400"
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
          <div className='w-3/5'>
            <div className="flex justify-between w-full">
              <div className="border-l text-center flex justify-center border-black text-xl sm:text-2xl md:w-1/3">
                Date
                <div onClick={() => setDateFilter(!datefilter)}
                  className='my-auto mx-2 cursor-pointer' >
                  {datefilter ? <ArrowUpNarrowWide /> :
                    <ArrowDownNarrowWide />}
                </div>
              </div>
              <div className="border-l flex justify-center my-auto border-black text-2xl sm:text-2xl md:w-1/3">
                <Listbox value={selectedStudentStatus} onChange={setSelectedStudentStatus}>
                  <div className="relative ">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-transparent py-1 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block text-xl truncate">{selectedStudentStatus.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {studentStatusOptions.map((person, personIdx) => (
                          <Listbox.Option
                            key={personIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                              }`
                            }
                            value={person}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {person.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
              <div className="border-l flex justify-center text-end mr-3 border-black text-xl sm:text-2xl md:w-1/3">
                <Listbox value={selectedPaymentStatus} onChange={setSelectedPaymentStatus}>
                  <div className="relative ">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-transparent py-1 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block text-xl truncate">{selectedPaymentStatus.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {studentPaymentOptions.map((person, personIdx) => (
                          <Listbox.Option
                            key={personIdx}
                            className={({ active }) =>
                              `relative cursor-default text-start select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                              }`
                            }
                            value={person}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {person.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div>
        {students.map((data, index) => (
          <table key={index} className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className=" md:w-1/5">
                  <div className="p-4">
                    <div onClick={() => handleClick(data)} className="w-40 h-40 bg-gray-200 rounded-full overflow-hidden">
                      <img className="w-full h-full object-cover" src={data.student.profile_picture.url} alt="" />
                    </div>
                  </div>
                </td>
                <td className="w-full md:w-4/5">
                  <div onClick={() => handleClick(data)} className="p-4 cursor-pointer">
                    <div className="text-xl flex  justify-between sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
                      <span className=' my-3 mx-start' >Student's Name: </span>
                      <span className='mx-auto my-3 ' >{data.student.full_name}</span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-evenly items-center">
                      <div className="mb-2 md:mb-0 ">
                        <p className="text-gray-600">Qualification: {data.student.qualification}</p>
                      </div>
                      <div className="mb-2 md:mb-0 ">
                        <p className="text-gray-600 ">Course: {data.course.header}</p>
                      </div>
                      <div>
                        <div className={`${data.status === 'Accepted' ? 'text-green-500' : data.status === 'Rejected' ? 'text-red-500' : data.status === 'Reapplied' ? 'text-pink-500' : 'text-cyan-500'} `}>Status: {data.status}</div>
                      </div>
                      <div>
                        <div className="text-red-500 ">Status: {data.paymentStatus}</div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>

      {/* Pagination controls */}
      <div className='flex justify-center py-5'>
        <div className='mb-10 flex justify-center bg-pink-50 '>
          <ul className='flex list-none'>
            {Array.from(
              { length: Math.ceil(totalApplication / applicationPerPage) },
              (_, i) => (
                <li key={i}>
                  <button
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 ml-2 border ${currentPage === i + 1
                      ? 'bg-sky-950 text-white'
                      : 'bg-white text-blue-700'
                      }`}
                  >
                    {i + 1}
                  </button>
                </li>
              )
            )}
          </ul>
          <button
            onClick={handlePrevClick}
            disabled={currentPage === 1}
            className={`px-4 py-2 ml-2 border ${currentPage === 1 ? 'bg-gray-400 text-white' : 'bg-sky-950 text-white'
              }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextClick}
            disabled={currentPage * applicationPerPage >= totalApplication}
            className={`px-4 py-2 ml-2 border ${currentPage * applicationPerPage >= totalApplication
              ? 'bg-gray-400 text-white'
              : 'bg-sky-950 text-white'
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>

  )
}

export default Students
