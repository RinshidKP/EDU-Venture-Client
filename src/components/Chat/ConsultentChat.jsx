import queryString from 'query-string';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { chatApi, consultentApi } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import Message from './Message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ContactList from './ContactList';


function ConsultentChat() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [receiverId, setReceiverId] = useState(null);
    const [receiverName, setReceiverName] = useState(null);

    const location = useLocation();

    const { Id,Token , Role ,DisplayImage,DisplayName} = useSelector((state) => state.User);
    const [userId, setUserId] = useState(Id);



    const socket = io('http://localhost:3000', {
        transports: ['websocket'],
        query: { userId },
    });
    socket.on('message', (message) => {
        // Handle incoming messages from the server
        if(receiverId===message.message.sender){
            console.log('Received message:', message);
            setChat((prevChat) => (prevChat ? [...prevChat, message.message] : [message.message]));
        }
    });

    socket.on('error', (error) => {
        console.error('Socket.io connection error:', error);
    });


    useEffect(() => {
        const queryParams = queryString.parse(location.search);
        if (queryParams._id) {
            setReceiverId(queryParams._id);
            setReceiverName(queryParams.full_name);
        }
    }, [location.search]);



    useEffect(() => {
        if (userId && receiverId) {
            chatApi
                .get(`/messages/${userId}/${receiverId}`)
                .then((response) => {
                    console.log('loading... ', response.data);
                    setChat(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching messages:", error);
                });
        }
    }, [userId, receiverId]);

    const recieverIdChange = (id) => {
      setReceiverId(id)
  }





    const sendMessage = () => {
        if (message.trim()) {
            // Emit the message to the server using socket.io
            socket.emit('message', message);
            chatApi.post('/messages', {
                text: message,
                sender: userId,
                receiver: receiverId
            }).then((response) => {
                console.log('response', response);
                setChat((prevChat) => (prevChat ? [...prevChat, response.data] : [response.data]));
        })  
            setMessage('');
        }
    };

    useEffect(() => {
      if (userId && receiverId) {
        consultentApi
          .post(`/mark_read`,
          {
            reciever: userId,
            sender: receiverId,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': Token,
              'userRole': Role
            }
          })
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
              <div className="py-2 px-3 bg-sky-300 flex flex-row justify-between items-center">
                <div className='flex justify-between items-center '>
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
                      <Message key={index} uniqueId={index === chat.length - 1 ? 'theLatestMessage' : `${index}`} text={message.text} timestamp={message.date} isUser={message.sender === userId} />
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

export default ConsultentChat;
