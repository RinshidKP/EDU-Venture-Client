import React from 'react'

const Message = ({ text, timestamp, isUser }) => {
            const date = new Date(timestamp);

        // Get the time string in Indian time (IST)
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' };
        const timeToShow = date.toLocaleTimeString('en-IN', options);
  return (
   
          <div className={`flex w-full mt-2 space-x-3 max-w-xs ${isUser ? 'ml-auto justify-end' : ''}`}>
            <div>
              <div className={`${isUser ? 'bg-blue-600 text-white rounded-l-lg rounded-br-lg' : 'bg-gray-300 rounded-r-lg rounded-bl-lg'} p-3`}>
                <p className="text-sm">{text}</p>
              </div>
              <span className="text-xs text-gray-500 leading-none">{timeToShow}</span>
            </div>
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          </div>

  )
}

export default Message
