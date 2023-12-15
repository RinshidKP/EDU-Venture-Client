import React, { useEffect, useState } from 'react';
import { useAdminAxiosInterceptor } from '../../customHooks/useAdminAxiosInterceptor';

const Transactions = () => {
    const [transactions,setTransactions] =useState([])
    const adminAxios = useAdminAxiosInterceptor();
    useEffect(()=>{
        adminAxios.get('/admin_transactions')
        .then((response)=>{
            setTransactions(response.data.transaction)
        })
    })
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'Asia/Kolkata' };
        return date.toLocaleDateString('en-IN', options);
    };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="text-sm leading-normal">
            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Name</th>
            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Date</th>
            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions && transactions.map((transaction, index) => (
            <tr key={index} className="hover:bg-grey-lighter">
              <td className="py-2 px-4 border-b border-grey-light text-center">{transaction?.course.header}</td>
              <td className="py-2 px-4 border-b border-grey-light text-center">{formatDate(transaction?.transactionDate)}</td>
              <td className="py-2 px-4 border-b border-grey-light text-center">{transaction?.course.fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
