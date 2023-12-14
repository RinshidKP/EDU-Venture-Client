import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useStudentAxiosIntercepter } from "../../customHooks/useStudentAxiosIntercepter";
import { useConsultantInterceptor } from "../../customHooks/useConsultantInterceptor";
import { baseImageUrl } from "../../config/apiURL";
import { Player } from 'video-react';
import { saveAs } from 'file-saver';
import 'video-react/dist/video-react.css';
import { Download } from "lucide-react";
import {format} from 'timeago.js'

const Message = ({recieverId, uniqueId, text, timestamp,type, isUser }) => {
  const [receiverData,setRecieverData] = useState()
  const date = new Date(timestamp);
  const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' };
  const timeToShow = date.toLocaleTimeString('en-IN', options);
  const studentAxios = useStudentAxiosIntercepter();
  const consultantAxios = useConsultantInterceptor();

  const targetRef = useRef(null);

  // useEffect(() => {
  //   if (targetRef.current) {
  //     targetRef.current.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //     });
  //   }
  // }, []);
  const { Role ,DisplayImage } = useSelector((state) => state.User);
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

  const handleDownload = (downloadUrl) => {
    const fileExtension = downloadUrl.split('.').pop().toLowerCase();
    const fileName = `download${fileExtension}`
    saveAs(downloadUrl, fileName);
  };

  return (

    <div
    ref={targetRef}
    id={uniqueId}
    className={`flex w-full mt-2 space-x-3 max-w-xs ${
      isUser ? 'ml-auto justify-end' : ''
    } sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl`}
  >
    {type===0 &&<div>
      <div
        className={`${
          isUser
            ? 'bg-blue-600 text-white rounded-l-lg rounded-br-lg'
            : 'bg-gray-300 rounded-r-lg rounded-bl-lg'
        } p-3`}
      >
        <p className="text-sm">{text}</p>
      </div>
      <span className="text-xs text-gray-500 leading-none">{timeToShow}</span>
    </div>}
    {type===4 &&
    <div className="overflow-hidden group/items" >
      <div >
        <div className="text-sm w-56 ">
            {/* <iframe className="h-28 w-52" src={`${baseImageUrl+text}`} ></iframe> */}
            <audio className="w-full" src={`${baseImageUrl+text}`} controls></audio>
        </div>
      </div>
      <div className="flex justify-between px-2" >
      <span className="text-xs text-gray-500 leading-none">{timeToShow}</span>
      <span onClick={()=>handleDownload(`${baseImageUrl+text}`)} className="cursor-pointer invisible group-hover/items:visible"><Download size={16} strokeWidth={1.5} /></span>
      </div>
    </div>}
    {type===3 &&
    <div className="overflow-hidden group/items" >
      <div >
        <div className="text-sm ">
            <iframe className="h-28 w-52" src={`${baseImageUrl+text}`} ></iframe>
        </div>
      </div>
      <div className="flex justify-between px-2" >
      <span className="text-xs text-gray-500 leading-none">{timeToShow}</span>
      <span onClick={()=>handleDownload(`${baseImageUrl+text}`)} className="cursor-pointer invisible group-hover/items:visible"><Download size={16} strokeWidth={1.5} /></span>
      </div>
    </div>}
    {type===2 &&
    <div className="group/items" >
      <div>
        <div className="text-sm">
          <img className="h-28 w-52" src={`${baseImageUrl+text}`} alt="" />
        </div>
      </div>
      <div className="flex justify-between px-2" >
      <span className="text-xs text-gray-500 leading-none">{timeToShow}</span>
      <span onClick={()=>handleDownload(`${baseImageUrl+text}`)} className="cursor-pointer invisible group-hover/items:visible"><Download size={16} strokeWidth={1.5} /></span>
      </div>
    </div>}
    {type===1 &&
    <div className="group/items my-1">
        <div className=" h-28 w-52 max-h-32 " >
          <Player fluid={false} >
            <source src={`${baseImageUrl+text}`} />
          </Player >
        </div>
      <div className="flex justify-between my-2 px-2" >
      <span className="text-xs text-gray-500 leading-none">{timeToShow}</span>
      <span onClick={()=>handleDownload(`${baseImageUrl+text}`)} className="cursor-pointer invisible group-hover/items:visible"><Download size={16} strokeWidth={1.5} /></span>
      </div>
    </div>}
    <div className="flex-shrink-0 h-10 w-10 rounded-full m-1 bg-gray-300 justify-center items-center">
      <img
        className="object-cover object-center h-10 w-10 rounded-full"
        src={isUser ? DisplayImage.url : receiverData?.profile_image?.url || receiverData?.profile_picture?.url}
        alt=""
      />
    </div>
  </div>
  

  )
}

export default Message
