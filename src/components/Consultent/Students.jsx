import React, { useEffect, useState } from 'react'
import { consultentApi } from '../../apiRoutes/studentAPI'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
const Students = () => {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const { Token, Role } = useSelector((state) => state.User);

  useEffect(() => {
    consultentApi.get('/students_consultent', {
      headers: {
        'Authorization': Token,
        'userRole': Role,
      }
    }).then((response) => {
      console.log(response);
      setStudents(response.data.students)
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  const handleClick = (data) => {
    navigate(`/view_student_profile`,{state :data})
  }

  return (
    <div>
      <nav className='bg-slate-300 py-2 my-2'>
        <div className='flex container mx-auto w-full'>
          <div className='w-2/5'></div>
          <div className='w-3/5'>
            <div className="flex justify-between w-full">
              <div className="border-l text-center border-black text-2xl w-1/3">Course</div>
              <div className="border-l text-center border-black text-2xl w-1/3">Student Status</div>
              <div className="border-l text-center border-black text-2xl w-1/3">Payment Status</div>
            </div>
          </div>
        </div>
      </nav>

      <div>
        {students.map((data) => (
          <table key={data.student._id} className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="w-1/5">
                  <div className="p-4">
                    <div onClick={()=>handleClick(data)} className="w-40 h-40 bg-gray-200 rounded-full overflow-hidden">
                      <img className="w-full h-full object-cover" src={data.student.profile_picture.url} alt="" />
                    </div>
                  </div>
                </td>
                <td className="w-1/5">
                  <div onClick={()=>handleClick(data)} className="p-4">
                    <h2 className="text-2xl font-semibold">Student's Name: {data.student.full_name}</h2>
                    <p className="text-gray-600">Qualification: {data.student.qualification}</p>
                  </div>
                </td>
                <td className="w-1/5">
                  <div onClick={()=>handleClick(data)} className="p-4">
                    <p className="text-gray-600 text-center">Course:{data.course.header}</p>
                  </div>
                </td>
                <td className="w-1/5">
                  <div  className="p-4">
                    <div className="text-green-500 text-center">Status: {data.status}</div>
                  </div>
                </td>
                <td className="w-1/5">
                  <div className="p-4">
                    <div className="text-red-500 text-center">Status: {data.paymentStatus}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>

    </div>



  )
}

export default Students
