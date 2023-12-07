import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { useConsultantInterceptor } from '../../customHooks/useConsultantInterceptor';

const Dashboard = () => {
  const navigate = useNavigate()
  const consultantAxios = useConsultantInterceptor();
  const [studentsCount, setStudentsCount] = useState();
  const [applicationCount, setApplicationCount] = useState();
  const [coursesCount, setCoursesCount] = useState();
  const [totalRevenue, setTotalRevenue] = useState(2000);
  const [pendingApplications, setPendingApplications] = useState([])
  const { Id } = useSelector((state) => state.User);

  const [usersChartData, setUsersChartData] = useState({
    labels: ['Students', 'Consultants'],
    datasets: [{
      data: [studentsCount, applicationCount],
      backgroundColor: ['#00F0FF', '#8B8B8D'],
    }],
  });

  const [commercesChartData, setCommercesChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      datalabels: {
        display: true,
        align: 'end',
        anchor: 'end',
        color: 'white',
      },
    }],
  });


  useEffect(() => {
    console.log(Id);

    if (Chart.helpers) {
      Chart.helpers.each(Chart.instances, (instance) => {
        instance.destroy();
      });
    }

    consultantAxios.get('/consultant_dashboard', {
      params: {
        id: Id,
      },
    }).then((response) => {
      //   console.log(response.data);
      setStudentsCount(response.data.acceptedStudents);
      setApplicationCount(response.data.applicationCount);
      setCoursesCount(response.data.courseCount);
      setPendingApplications(response.data.pendingApplications)
      setUsersChartData({
        labels: ['Accepted Students', 'Applications', 'Courses'],
        datasets: [{
          data: [response.data.acceptedStudents, response.data.applicationCount, response.data.courseCount],
          backgroundColor: ['#00F0FF', '#7aeb34', '#e3ba49'],
        }],
      });

      const labels = response.data.coursesWithApplicationCount.map((course) => course.header);

      const data = response.data.coursesWithApplicationCount.map((course) => course.applicationCount);
      console.log(response.data.pendingApplications);

      setCommercesChartData({
        labels: labels,
        datasets: [{
          label: 'Number of Applications',
          data,
          datalabels: {
            display: true,
            align: 'end',
            anchor: 'end',
          },
        }],
      });

    }).catch((error) => {
      console.log(error);
    })
  }, [])

  const DataBox = ({ title, count, color }) => (
    <div className="flex-1  my-4 mx-2 sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 bg-cyan-200 p-4 shadow rounded-lg">
      <h2 className="text-gray-500 text-lg font-semibold pb-1">{title}</h2>
      <div className="my-1"></div>
      <div className={`text-3xl font-bold ${color}`}>{count}</div>
    </div>
  );
  
  return (
    <div className="flex flex-col h-full bg-gray-100 pb-10">
      <div className="mt-4 flex flex-wrap mx-5 space-x-4">
        <DataBox title="Students" count={studentsCount} color="text-cyan-500" />
        <DataBox title="Applications" count={applicationCount} color="text-cyan-500" />
        <DataBox title="Revenue" count={totalRevenue} color="text-cyan-500" />
        <DataBox title="Courses" count={coursesCount} color="text-cyan-500" />
      </div>

      <div className="flex-1 p-4 w-full">


        <div className="flex flex-wrap w-full justify-evenly">
          <div className="w-full sm:w-2/5  py-5 bg-white p-4 shadow rounded-lg mb-4">
            <h2 className="text-gray-500 text-lg font-semibold pb-1">Users</h2>
            <div className="my-1"></div>
            <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
            <div className="chart-container relative w-full h-4/5">
              <Doughnut
                key="usersChart"
                data={usersChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  legend: {
                    position: 'bottom',
                  },
                }}
              />
            </div>
          </div>

          <div className="w-full sm:w-2/5  py-5 bg-white p-4 shadow rounded-lg mb-4">
            <h2 className="text-gray-500 text-lg font-semibold pb-1">Businesses</h2>
            <div className="my-1"></div>
            <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
            <div className="chart-container flex items-center justify-center relative w-full">
              <Bar
                key="commercesChart"
                data={commercesChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    x: {
                      grid: {
                        display: true,
                      },
                      title: {
                        display: true,
                        text: 'Courses',
                      },
                    },
                    y: {
                      grid: {
                        display: true,
                      },
                      title: {
                        display: true,
                        text: 'Application Count',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Courses And Applications',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>



        <div className="flex flex-col lg:flex-row mt-8 space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 bg-white p-4 shadow rounded-lg overflow-x-auto">
            <h2 className="text-gray-500 text-lg font-semibold pb-4">Pending Authorizations</h2>
            <div className="my-1"></div>
            <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-sm leading-normal">
                  <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-grey-light border-b border-grey-light text-center">Student</th>
                  <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-grey-light border-b border-grey-light text-center">Name</th>
                  <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-grey-light border-b border-grey-light text-center">Course</th>
                  <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-grey-light border-b border-grey-light text-center">Name</th>
                </tr>
              </thead>
              <tbody>
                {pendingApplications.map((application, index) => (
                  <tr key={index} className="hover:bg-grey-lighter">
                    <td className="py-2 px-4 border-b border-grey-light text-center">
                      <img src={application?.student.profile_picture?.url} alt="Profile" className="rounded-full h-10 w-10 mx-auto" />
                    </td>
                    <td className="py-2 px-4 border-b border-grey-light text-center">{application?.student?.full_name}</td>
                    <td className="py-2 px-4 border-b border-grey-light text-center">
                      <img src={application?.course.course_image?.url} alt="Profile" className="rounded-full h-10 w-10 mx-auto" />
                    </td>
                    <td className="py-2 px-4 border-b border-grey-light text-center">{application?.course.header}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-4">
              <button onClick={() => navigate('/consultent_student')} className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded">
                View More
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white p-4 shadow rounded-lg overflow-x-auto">
            <div className="bg-white p-4 rounded-md mt-4">
              <h2 className="text-gray-500 text-lg font-semibold pb-4">Transactions</h2>
              <div className="my-1"></div>
              <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-sm leading-normal">
                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Name</th>
                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Date</th>
                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Table content for Transactions */}
                </tbody>
              </table>
              <div className="text-right mt-4">
                <button onClick={()=>navigate('/consultent_student')} className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded">
                  View More
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  );
};

export default Dashboard;