import queryString from 'query-string';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { chatApi } from '../../apiRoutes/studentAPI';
import { apiUrls } from '../../config/apiURL';
import { useSelector } from 'react-redux';
import Message from './Message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


function ConsultentChat() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [receiverId, setReceiverId] = useState(null);
    const [receiverName, setReceiverName] = useState(null);

    const location = useLocation();

    const { Id } = useSelector((state) => state.User);
    const [userId, setUserId] = useState(Id);



    // const socket = io(apiUrls.chatUrl);
    const socket = io('http://localhost:3000', {
        transports: ['websocket'],
        query: { userId },
    });
    socket.on('message', (message) => {
        // Handle incoming messages from the server
        console.log('Received message:', message);
        setChat((prevChat) => (prevChat ? [...prevChat, message.message] : message.message));
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


    return (
        <div className="flex flex-col items-center justify-center w-full h-[87%] bg-gray-100 text-gray-800 p-10">
            <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
                    {chat.map((message, index) => (
                        <Message key={index} text={message.text} timestamp={message.date} isUser={message.sender === userId} />
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
                        className="bg-cyan-800 h-10 flex items-center justify-center text-white rounded-r p-2 md:p-3"
                        onClick={sendMessage}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} /> 
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConsultentChat;
