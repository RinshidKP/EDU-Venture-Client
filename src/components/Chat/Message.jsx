import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useStudentAxiosIntercepter } from "../../customHooks/useStudentAxiosIntercepter";
import { useConsultantInterceptor } from "../../customHooks/useConsultantInterceptor";

const Message = ({recieverId, uniqueId, text, timestamp, isUser }) => {
  const [receiverData,setRecieverData] = useState()
  const date = new Date(timestamp);
  const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' };
  const timeToShow = date.toLocaleTimeString('en-IN', options);
  const studentAxios = useStudentAxiosIntercepter();
  const consultantAxios = useConsultantInterceptor();


  useEffect(()=>{
    const targetElement = document.getElementById(`theLatestMessage`);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  },[])
  const { Token, Role ,DisplayImage } = useSelector((state) => state.User);
  useEffect(()=>{
    if (Role === 'student' || Role === 'admin'){
      studentAxios.get(`/reciever_details`, {
        params: {
            id: recieverId,
        },
    }).then((response)=>{
      setRecieverData(response.data.user)
    }).catch((error)=>{
      console.error(error);
    })
    }else{
      consultantAxios.get(`/reciever_details`, {
        params: {
            id: recieverId,
        }
    }).then((response)=>{
      setRecieverData(response.data.user)
    }).catch((error)=>{
      console.error(error);
    })
    }
  },[recieverId])

  return (

    <div id={uniqueId} className={`flex w-full mt-2 space-x-3 max-w-xs ${isUser ? 'ml-auto justify-end' : ''}`}>
      <div>
        <div className={`${isUser ? 'bg-blue-600 text-white rounded-l-lg rounded-br-lg' : 'bg-gray-300 rounded-r-lg rounded-bl-lg'} p-3`}>
          <p className="text-sm">{text}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">{timeToShow}</span>
      </div>
      <div className="flex-shrink-0 h-10 w-10 rounded-full m-1 bg-gray-300 justify-center items-center">
        <img
          className="object-cover object-center h-full w-full rounded-full"
          src={isUser ? DisplayImage.url : receiverData?.profile_image?.url||receiverData?.profile_picture?.url}
          alt=""
        />
      </div>
    </div>

  )
}

export default Message
