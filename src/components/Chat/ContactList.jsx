import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { showErrorToast } from '../../helpers/toaster';
import { useStudentAxiosIntercepter } from '../../customHooks/useStudentAxiosIntercepter';
import { useConsultantInterceptor } from '../../customHooks/useConsultantInterceptor';
import { format } from 'timeago.js';
const ContactList = ({ recieverIdChange, receiverId }) => {
    const [chats, setChats] = useState([]);
    const [unread, setUnread] = useState(false);
    const [newMessage, setNewMessage] = useState(false);
    const { Token, Role, Id } = useSelector((state) => state.User);

    const studentAxios = useStudentAxiosIntercepter();
    const consultantAxios = useConsultantInterceptor();


    useEffect(() => {
        if (Role === 'student' || Role === 'admin') {

            studentAxios.get(`/chat_list`, {
                params: {
                    id: Id,
                }
            }).then((response) => {
                // console.log(response);
                // console.log(response.data.chats[0].latestMessage);
                setChats(response.data.chats)
            }).catch((error) => {
                console.log(error)
                console.error('Error fetching chat list:', error);
            })
        } else {

            consultantAxios.get(`/chat_list`, {
                params: {
                    id: Id,
                },
            }).then((response) => {
                // console.log(response);
                setChats(response.data.chats)
            }).catch((error) => {
                console.log(error)
                console.error('Error fetching chat list:', error);
            })
        }
    }, [])

    const socket = io('https://eduventure.live', {
        transports: ['websocket'],
        query: { userId: Id },
      });

      socket.on('message', (message) => {
        console.log('Received message:', message.message.sender);
        setNewMessage(message.message.sender)
      });

    useEffect(() => {
        if (Role === 'student' || Role === 'admin') {
            studentAxios.get(`/unread_between_users`, {
                params: {
                    id: Id,
                    sender: newMessage,
                }
            }).then((response) => {
                if (response.status === 200) {
                    setUnread(response.data.unread + 1)
                }
            }).catch((error) => {
                showErrorToast(error.message)
            })
        } else {
            consultantAxios.get(`/unread_between_users`, {
                params: {
                    id: Id,
                    sender: newMessage,
                },
            }).then((response) => {
                if (response.status === 200) {
                    setUnread(response.data.unread)
                }
            }).catch((error) => {
                showErrorToast(error.message)
            })
        }
    }, [Id, Role, Token, newMessage])

    const handleChange = (id) => {
        if (id === newMessage) {
            setUnread(false)
        }
        recieverIdChange(id)
    }

    const normal = "h-20 rounded-lg mb-2 border border-1 bg-cyan-200 flex items-center justify-between border-white p-2 hover:bg-gray-100"
    const highlighted = "h-20 rounded-lg mb-2 border border-1 flex items-center bg-white justify-between border-white p-2"
    return (
        <div className='h-full p-1 bg-sky-100'>
            {chats.map((chat, index) => (
            <div key={index} onClick={() => handleChange(chat._id)} className={`${receiverId === chat._id ? highlighted : normal} flex items-center justify-between p-3 border-b border-gray-300`}>
                <div className='flex items-center space-x-3'>
                <img className='h-10 w-10 rounded-full' src={chat.profile_picture ? chat?.profile_picture.url : chat?.profile_image.url} alt="" />
                <div className='flex flex-col justify-start items-start ml-3'>
                    <div className="text-center">{chat?.full_name ? chat?.full_name : chat?.consultancy_name}</div>
                    <div className={`text-xs ${ chat.latestMessage?.read=== false && chat.latestMessage.sender!==Id ? 'animate-pulse border border-1 border-red-500 rounded-lg px-1 bg-white text-red-900' : ''}`}>
                    {chat.latestMessage?.text}
                    </div>
                </div>
                </div>
                <div className='flex flex-col items-end'>
                <div className='text-xs'>
                    {format(chat.latestMessage?.date)}
                    {/* {chat.latestMessage?.date && new Date(chat.latestMessage.date).toLocaleString('en-IN', {
                    hour: 'numeric',
                    minute: 'numeric',
                    })} */}
                </div>
                </div>
                
            </div>
            ))}
        </div>

    )
}

export default ContactList
