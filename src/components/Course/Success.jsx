import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';

const Success = () => {
  const { applicationId } = useParams();
  const studentAxios = useStudentAxiosIntercepter();

  const [transaction, setTransaction] = useState({})
  const [application, setApplication] = useState({})
  useEffect(() => {
    console.log('applicationId', applicationId);
    studentAxios.get('/checkout_confirm', {
      params: {
        applicationId: applicationId,
      }
    })
      .then((response) => {
        setTransaction(response.data.transaction[0]);
        setApplication(response.data.application);
        console.log(response);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

  }, [applicationId])

  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }


  return (
    <div className="bg-gray-300 h-full flex items-center justify-center">
      {/* Content Start */}
      <div className="max-w-screen-md bg-white  px-8 rounded shadow-md my-10">
        {/* Generic Pod Left Aligned with Price breakdown Start */}
        <div className="border-l-4 border-r-4 border-gray-200 p-4">
          <div className="ml-4">
            <p>
              Hi {application?.student?.full_name},
            </p>
          </div>
          <div className="ml-4 mr-4 mt-4">
            <p className="font-bold">Transaction reference: {transaction.transactionId}</p>
            <p>Order date: {formatDate(transaction.transactionDate)}</p>
            <p className="font-bold">Payment Details:</p>
            <p>
              Course: {application?.course?.header} <br />
            </p>
            <p>
              Consultant Name: {application?.course?.creator_id?.consultancy_name} <br />
            </p>
            <p>
              Country Name: {application?.course?.country?.name} <br />
            </p>
            <p>
              Amount: ₹{application?.course?.fee} <br />
            </p>
            <p>We advise keeping this email for future reference.</p>
          </div>
        </div>
        {/* Generic Pod Left Aligned with Price breakdown End */}
      </div>
      {/* Content End */}
    </div>
  );
};

export default Success;
