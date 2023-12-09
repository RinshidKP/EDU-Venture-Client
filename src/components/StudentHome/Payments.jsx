import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter'

const Payments = () => {
    const { Id } = useSelector((state) => state.User);
    const [transactions, setTransactions] = useState([]);
    const studentAxios = useStudentAxiosIntercepter()
    useEffect(() => {
        if (Id) {
            studentAxios.get(`/transactions?studentId=${Id}`)
                .then((response) => {
                    console.log('Transactions:', response.data);
                    setTransactions(response.data.transactions)
                })
                .catch((error) => {
                    console.error('Error fetching transactions:', error);
                });
        }
    }, [Id, studentAxios]);
    return (
        <div>
            <nav style={{ backgroundColor: '#F3F8F9' }} className="cursor-pointer dark:bg-gray-800">
                <div className="container mx-auto">
                    <div className="border  ">
                        <div className="flex items-center justify-center p-6 text-dark-600 capitalize dark:text-gray-300">
                            <h1 className='text-2xl'>Payments</h1>
                        </div>
                    </div>
                </div>
            </nav>
            <body>
            <div className="container mx-auto mt-6 p-6 bg-white shadow-md rounded-md">
  {transactions ? (
    transactions.map((transaction, index) => (
      <div key={index} className="mb-6 border p-6 rounded-md bg-gray-100">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">{transaction.course?.header}</h2>
            <p className="text-sm text-gray-500">Transaction ID: {transaction.transactionId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{new Date(transaction.transactionDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold">Amount: ${transaction?.course?.fee}</p>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-sm">Payer: {transaction.payer.full_name}</p>
            <p className="text-sm">Application Date: {new Date(transaction.application?.applicationDate).toLocaleDateString()}</p>
            <p className="text-sm">Transaction Date: {new Date(transaction.transactionDate).toLocaleDateString()}</p>
          </div>
          {/* You can add more details here as needed */}
        </div>
      </div>
    ))
  ) : (
    <div className="text-center text-gray-500">NO Bills Yet</div>
  )}
</div>


            </body>
        </div>
    )
}

export default Payments
