import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { chatApi, studentAPI } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Message from './Message';
import ContactList from './ContactList';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';

function StudentChat() {
  const studentAxios = useStudentAxiosIntercepter();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverName, setReceiverName] = useState(false);
  // const [new , setNew] = useState(false);
  const location = useLocation();
  const { Id ,Token ,Role,DisplayImage,DisplayName } = useSelector((state) => state.User);
  const [userId, setUserId] = useState(Id);

  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    query: { userId },
  });

  socket.on('message', (message) => {
      if(receiverId===message.message.sender){
        console.log('Received message:',message);
        setReceiverName(!receiverName);
        setChat((prevChat) => (prevChat ? [...prevChat, message.message] : [message.message]));
    }
  });

  socket.on('error', (error) => {
    console.error('Socket.io connection error:', error);
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('_id')) {
      setReceiverId(queryParams.get('_id'));
      setReceiverName(queryParams.get('consultancy_name'));
    }
  }, [location.search,receiverName]);

  useEffect(() => {
    if (userId && receiverId) {
      chatApi
        .get(`/messages/${userId}/${receiverId}`)
        .then((response) => {
          // console.log('messages', response.data);
          setChat(response.data.messages );
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [userId, receiverId]);

  const recieverIdChange = (id) => {
        setReceiverId(id)
  }

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message);
      chatApi
        .post('/messages', {
          text: message,
          sender: userId,
          receiver: receiverId,
        })
        .then((response) => {
          console.log('response', response);
          setChat((prevChat) => (prevChat ? [...prevChat, response.data] : [response.data]));
        });
      setMessage('');
    }
  };

  useEffect(() => {
    if (userId && receiverId) {
      studentAxios
        .post(`/mark_read`,
        {
          reciever: userId,
          sender: receiverId,
        }
        )
        .then((response) => {
          console.log('messages', response.data);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [userId, receiverId ,Role ,Token]);

  return (
    <div className="h-[88%] flex flex-col">
      <div className="container mx-auto flex-1">
        <div className=" h-full flex">
          <div className="flex border border-gray-400 rounded shadow-lg h-full w-full">
            {/* Left */}
            <div className="w-1/3 border flex flex-col">
              {/* Header */}
              <div className=" bg-sky-100 flex flex-row justify-between items-center">
                <div className='flex m-1 border border-white py-3 px-3 w-full rounded-lg justify-between items-center '>
                  <img className="w-10 h-10 rounded-full" src={DisplayImage.url} alt="Avatar" />
                  <h3 className='mx-3 text-center'>{DisplayName}</h3>
                </div>
                <div className="flex">
                  
                </div>
              </div>

              {/* Contacts */}
              <div className="bg-gray-300 flex-1 flex-grow overflow-auto">
                {/* Contacts list */}
                <ContactList recieverIdChange={recieverIdChange} receiverId={receiverId}/>
              </div>
            </div>

            {/* Right */}
            <div className="w-2/3 border flex flex-col">

              {/* Right side content */}
              <div className="flex flex-col flex-grow items-center justify-center w-full h-full bg-gray-100 text-gray-800 p-10">

                <div className="flex flex-col flex-grow w-2/3 max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
                  <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
                    {chat.map((message, index) => (
                      <Message key={index} recieverId={message.sender === userId ? message.receiver : message.sender} uniqueId={index === chat.length - 1 ? 'theLatestMessage' : `${index}`} text={message.text} timestamp={message.date} isUser={message.sender === userId} />
                    ))}
                  </div>
                  <div className="bg-gray-300 p-4 flex">
                    <input
                      value={message}
                      className="flex-grow rounded-l px-2 text-sm border border-gray-300 focus:outline-none"
                      type="text"
                      placeholder="Type your message…"
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      className="bg-emerald-800 h-10 flex items-center justify-center text-white rounded-r p-2 md:p-3"
                      onClick={sendMessage}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentChat;
