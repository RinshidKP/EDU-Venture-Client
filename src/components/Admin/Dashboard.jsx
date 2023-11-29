import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import 'chartjs-plugin-datalabels';
import { useNavigate } from 'react-router-dom';
import { useAdminAxiosInterceptor } from '../../customHooks/useAdminAxiosInterceptor';


const Dashboard = () => {
  const navigate = useNavigate()
  const [studentsCount, setStudentsCount] = useState();
  const [consultantsCount, setConsultantsCount] = useState();
  const [coursesCount, setCoursesCount] = useState();
  const [totalRevenue, setTotalRevenue] = useState(2000);
  const [unApproved, setUnApproved] = useState([]);
  const { Token, Role } = useSelector((state) => state.User);
  const adminAxios = useAdminAxiosInterceptor();

  const [usersChartData, setUsersChartData] = useState({
    labels: ['Students', 'Consultants'],
    datasets: [{
      data: [studentsCount, consultantsCount],
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
    adminAxios.get('/admin_dashboard')
    .then((response) => {
      console.log(response.data);
      setStudentsCount(response.data.studentsCount);
      setConsultantsCount(response.data.consultantsCount);
      setCoursesCount(response.data.courseCount);
      setUnApproved(response.data.unApprovedConsultants)
      setUsersChartData({
        labels: ['Students', 'Consultants'],
        datasets: [{
          data: [response.data.studentsCount, response.data.consultantsCount],
          backgroundColor: ['#00F0FF', '#7aeb34'],
        }],
      });

      const labels = response.data.countriesWithCourseCount.map((country) => country.name);

      const data = response.data.countriesWithCourseCount.map((country) => country.courseCount);
      console.log(labels);

      setCommercesChartData({
        labels: labels,
        datasets: [{
          label: 'Count of Courses',
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
    <div className="flex-1 bg-cyan-200 p-4 shadow rounded-lg">
      <h2 className="text-gray-500 text-lg font-semibold pb-1">{title}</h2>
      <div className="my-1"></div>
      <div className={`text-3xl font-bold ${color}`}>{count}</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-100 pb-10">

      <div className="mt-8 flex flex-wrap  mx-5 space-x-4">
        <DataBox title="Students" count={studentsCount} color="text-cyan-500" />
        <DataBox title="Consultants" count={consultantsCount} color="text-cyan-500" />
        <DataBox title="Revenue" count={totalRevenue} color="text-cyan-500" />
        <DataBox title="Courses" count={coursesCount} color="text-cyan-500" />
      </div>

      <div className="flex-1 p-4 w-full">


        <div className="mt-8 flex flex-wrap space-x-4">
          <div className="flex-1 bg-white p-4 shadow rounded-lg">
            <h2 className="text-gray-500 text-lg font-semibold pb-1">Users</h2>
            <div className="my-1"></div>
            <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
            <div className="chart-container relative w-full h-4/5">
              <Doughnut data={usersChartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  position: 'bottom',
                },
              }} />
            </div>
          </div>

          <div className="flex-1 bg-white p-4 shadow rounded-lg">
            <h2 className="text-gray-500 text-lg font-semibold pb-1">Businesses</h2>
            <div className="my-1"></div>
            <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
            <div className="chart-container flex items-center justify-center relative w-full ">
              {/* {console.log(commercesChartData)} */}
              <Bar
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
                        text: 'Countries',
                      },
                    },
                    y: {
                      grid: {
                        display: true,
                      },
                      title: {
                        display: true,
                        text: 'Courses Count',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Countries And Courses',
                    },
                    datalabels: {
                      display: true,
                      align: 'end',
                      anchor: 'end',
                      formatter: (value, context) => {
                        const index = context.dataIndex;
                        return commercesChartData.labels[index];
                      },
                    },
                  },
                }}
              />


            </div>
          </div>
        </div>


        <div className="flex mt-8 space-x-4">
          <div className="flex-1 bg-white p-4 shadow rounded-lg">
            <h2 className="text-gray-500 text-lg font-semibold pb-4">Pending Authorizations </h2>
            <div className="my-1"></div>
            <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-sm leading-normal">
                  <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-grey-light border-b border-grey-light text-center">Photo</th>
                  <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-grey-light border-b border-grey-light text-center">Name</th>
                  <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-grey-light border-b border-grey-light text-center">Role</th>
                </tr>
              </thead>
              <tbody>
                {unApproved.map((consultant,index) => (
                  <tr key={index} className="hover:bg-grey-lighter">
                    <td className="py-2 px-4 border-b border-grey-light text-center">
                      <img src={consultant.profile_image.url} alt="Profile" className="rounded-full h-10 w-10 mx-auto" />
                    </td>
                    <td className="py-2 px-4 border-b border-grey-light text-center">{consultant.consultancy_name}</td>
                    <td className="py-2 px-4 border-b border-grey-light text-center">{consultant.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>


            <div className="text-right mt-4">
              <button onClick={()=>navigate('/dashboard_consultencies')} className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded">
                View More
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white p-4 shadow rounded-lg">
            <div className="bg-white p-4 rounded-md mt-4">
              <h2 className="text-gray-500 text-lg font-semibold pb-4">Transactions</h2>
              <div className="my-1"></div>
              <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
              <table className="w-full table-auto text-sm">
                {/* Table content for Transactions */}
                <thead>
                  <tr className="text-sm leading-normal">
                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Name</th>
                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Date</th>
                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-grey-lighter">
                  </tr>
                </tbody>
              </table>
              <div className="text-right mt-4">
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded">
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