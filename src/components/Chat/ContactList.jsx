import { useEffect, useState } from 'react'
import { consultentApi, studentAPI } from '../../apiRoutes/studentAPI'
import { useSelector } from 'react-redux';
import { baseImageUrl } from '../../config/apiURL';
import { io } from 'socket.io-client';
import { showErrorToast } from '../../helpers/toaster';

const ContactList = ({recieverIdChange,receiverId}) => {
    const [chats,setChats] = useState([]);
    const [unread, setUnread] = useState(false);
    const [newMessage, setNewMessage] = useState(false);
    const { Token,Role,Id } = useSelector((state) => state.User);
    useEffect(()=>{
        if(Role==='student'||Role==='admin'){

            studentAPI.get(`/chat_list`,{
                params: {
                    id: Id,
                  },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Token,
                    'userRole': Role
                  }
            }).then((response)=>{
                // console.log(response);
                setChats(response.data.chats)
            }).catch((error)=>{
                console.log(error)
                console.error('Error fetching chat list:', error);
            })
        }else{

            consultentApi.get(`/chat_list`,{
                params: {
                    id: Id,
                  },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Token,
                    'userRole': Role
                  }
            }).then((response)=>{
                console.log(response);
                setChats(response.data.chats)
            }).catch((error)=>{
                console.log(error)
                console.error('Error fetching chat list:', error);
            })
        }
    },[])

    // const socket = io('http://localhost:3000', {
    //     transports: ['websocket'],
    //     query: { userId: Id },
    //   });

    //   socket.on('message', (message) => {
    //     console.log('Received message:', message.message.sender);
    //     setNewMessage(message.message.sender)
    //   });

      useEffect(()=>{
        if(Role==='student'||Role==='admin'){
            studentAPI.get(`/unread_between_users`,{
                params: {
                    id: Id,
                    sender :newMessage,
                  },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Token,
                    'userRole': Role
                  }
            }).then((response)=>{
                if(response.status===200){
                    setUnread(response.data.unread+1)
                }
            }).catch((error)=>{
                showErrorToast(error.message)
            })
        }else{
            consultentApi.get(`/unread_between_users`,{
                params: {
                    id: Id,
                    sender :newMessage,
                  },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Token,
                    'userRole': Role
                  }
            }).then((response)=>{
                if(response.status===200){
                    setUnread(response.data.unread)
                }
            }).catch((error)=>{
                showErrorToast(error.message)
            })
        }
      },[Id,Role,Token,newMessage])

      const handleChange = (id) => {
        if(id===newMessage){
            setUnread(false)
        }
        recieverIdChange(id)
      }
      
    const normal = "h-20 rounded-lg mb-2 border border-1 bg-cyan-600 flex items-center justify-between border-white p-2 hover:bg-gray-100"
    const highlighted = "h-20 rounded-lg mb-2 border border-1 flex items-center bg-white justify-between border-white p-2"
  return (
    <div className='h-full p-2 bg-sky-100'>
        {chats.map((chat,index) => (
        <div key={index} onClick={()=>handleChange(chat._id)} className={receiverId===chat._id ? highlighted : normal}>
            <div className='flex  items-center justify-evenly'>
            <div className="text-center mx-3"><img className='h-10 w-10 rounded-full' src={chat.profile_picture ?( chat?.profile_picture.url ): (chat?.profile_image.url) } alt="" /></div>
            <div className="text-center">{chat?.full_name ? chat?.full_name : chat?.consultancy_name}</div>
            </div>
            {chat?._id===newMessage&&(<div className="text-sm bg-white rounded-full p-2 text-red-500">
                {unread}
            </div>)}
        </div>
        ))}
    </div>

  )
}

export default ContactList
