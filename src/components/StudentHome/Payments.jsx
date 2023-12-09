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
                {transactions ? transactions.map((transaction, index) => (
                    <div key={index}>
                        <p>Amount: {transaction?.course?.fee}</p>
                        <p>Date: {transaction.transactionDate}</p>
                        {/* Add more lines to display other transaction properties */}
                    </div>
                )) : <div>Nothing</div>}

            </body>
        </div>
    )
}

export default Payments
