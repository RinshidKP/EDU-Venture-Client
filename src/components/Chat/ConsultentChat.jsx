import queryString from 'query-string';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { chatApi } from '../../apiRoutes/studentAPI';
import { useSelector } from 'react-redux';
import Message from './Message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faPaperPlane, faSmile } from '@fortawesome/free-solid-svg-icons';
import ContactList from './ContactList';
import EmojiPicker from 'emoji-picker-react';
import { useConsultantInterceptor } from '../../customHooks/useConsultantInterceptor';
import { ToastContainer } from 'react-toastify';
import { Mic, Upload } from 'lucide-react';
import Dropzone from 'react-dropzone';
import AudioRecorder from './AudioRecorder';
import { showErrorToast } from '../../helpers/toaster';

function ConsultentChat() {
  const [showSidebar, setShowSidebar] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [receiverId, setReceiverId] = useState(null);
    const [newMessage, setNewMessage] = useState(false);
    const consultantAxios = useConsultantInterceptor();
    const [onEmoji, setOnEmoji] = useState(false);

    const location = useLocation();

    const { Id,DisplayImage,DisplayName} = useSelector((state) => state.User);
    const [userId, setUserId] = useState(Id);
    const [record, setRecord] = useState(false);

    const toggleRecordOption = () => {
      setRecord(!record)
    }


    const socket = io('http://localhost:3000', {
        transports: ['websocket'],
        query: { userId },
    });
    socket.on('message', (message) => {
        // Handle incoming messages from the server
        if(receiverId===message.message.sender){
            console.log('Received message:', message);
            setNewMessage(!newMessage);
            setChat((prevChat) => (prevChat ? [...prevChat, message.message] : [message.message]));
        }
    });

    // socket.on('error', (error) => {
    //     console.error('Socket.io connection error:', error);
    // });


    useEffect(() => {
        const queryParams = queryString.parse(location.search);
        if (queryParams._id) {
            setReceiverId(queryParams._id);
            setNewMessage(queryParams.full_name);
        }
    }, [location.search]);

    useEffect(() => {
        if (userId && receiverId) {
            chatApi
                .get(`/messages/${userId}/${receiverId}`)
                .then((response) => {
                    // console.log('loading... ', response.data);
                    setChat(response.data.messages);
                })
                .catch((error) => {
                    console.error("Error fetching messages:", error);
                });
        }
    }, [userId, receiverId ,newMessage]);

    const recieverIdChange = (id) => {
      setReceiverId(id)
  }

    const sendMessage = () => {
      setOnEmoji(false)
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
        consultantAxios
          .post(`/mark_read`,
          {
            reciever: userId,
            sender: receiverId,
          })
          .then((response) => {
            console.log('messages', response.data);
          })
          .catch((error) => {
            console.error('Error fetching messages:', error);
          });
      }
    }, [userId, receiverId]);

    const handleEmojiClick = (emoji) => {
      console.log(message+" ",emoji.emoji);
      setMessage(message+' '+emoji.emoji)
    }

    
  const onDrop = (files) => {
    console.log(files[0])
    const fileName = files[0].name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    const fileTypeMapping = {
      'jpg': 2,
      'jpeg': 2,
      'png': 2,
      'gif': 2,
      'mp4': 1,
      'mov': 1,
      'avi': 1,
      'doc': 3,
      'docx': 3,
      'pdf': 3,
    };

    const fileType = fileTypeMapping[fileExtension] || 0;

    console.log(fileType);
    if (fileType === 0 || !fileType) {
      showErrorToast('File type not recognized!');
    }

    let formData = new FormData;
    formData.append("file", files[0])
    chatApi.post('/uploadfiles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => {
      console.log(response);
      if (response.data.success) {
        chatApi
          .post('/messages', {
            text: response.data.url,
            sender: userId,
            receiver: receiverId,
            type: fileType
          })
          .then((response) => {
            console.log('response', response);
            setChat((prevChat) => (prevChat ? [...prevChat, response.data] : [response.data]));
          });
        setMessage('');
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  const onAudioSubmit = (voice) => {
    // const fileExtension = voice.name.split('.').pop().toLowerCase();
    // console.log(fileExtension,voice);
    if(voice.size<=0){
      showErrorToast(`the voice size is low ${voice.size}`)
    }
    let formData = new FormData;
    formData.append("file", voice)
    chatApi.post('/uploadfiles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => {
      console.log(response);
      if (response.data.success) {
        chatApi
          .post('/messages', {
            text: response.data.url,
            sender: userId,
            receiver: receiverId,
            type: 4
          })
          .then((response) => {
            console.log('response', response);
            setChat((prevChat) => (prevChat ? [...prevChat, response.data] : [response.data]));
          });
        setMessage('');
      }
    }).catch((error) => {
      console.log(error)
    })
  }

    return (
      <div className="h-[87%] w-full overflow-hidden ">
        <div className="flex h-full  md:flex-row ">
          {/* Left Panel */}
          <div className="hidden md:block md:w-2/5 ">
            <div className="bg-sky-100 flex flex-row justify-between items-center p-2">
              <div className="flex mx-5 my-3 p-auto rounded-lg justify-between items-center w-full">
                <img className="w-10 h-10 rounded-full" src={DisplayImage.url} alt="Avatar" />
                <h3 className="mx-3 text-xl md:text-2xl">{DisplayName}</h3>
              </div>
            </div>
  
            {/* Contacts */}
            <div className="bg-gray-300 h-full overflow-hidden">
              <ContactList recieverIdChange={recieverIdChange} receiverId={receiverId} />
            </div>
          </div>
  
          {/* Right Panel */}
          <div className="w-full md:w-3/5 border">
            <div className={`md:w-2/5 p-2 ${showSidebar ? 'block' : 'hidden'}`}>
              <div className="bg-sky-100 flex flex-row justify-between items-center p-2">
                <div className="flex mx-5 my-3 p-auto rounded-lg justify-between items-center w-full">
                  <img className="w-10 h-10 rounded-full" src={DisplayImage.url} alt="Avatar" />
                  <h3 className="mx-3 text-xl md:text-2xl">{DisplayName}</h3>
                </div>
              </div>
  
              {/* Contacts */}
              <div className="bg-gray-300 h-full overflow-hidden">
                <ContactList recieverIdChange={recieverIdChange} receiverId={receiverId} />
              </div>
            </div>
            <div className="w-full h-full bg-gray-100 text-gray-800 overflow-y-hidden">
              {receiverId ? (
                <div className='h-full ' >
                  <div className="flex flex-col w-full h-full bg-white shadow-xl rounded-lg ">
                    <div className="flex flex-col p-4 h-[95%] overflow-y-auto">
                      <div className='fixed right-2' >
                        <button
                          className="md:hidden bg-sky-100 rounded p-2"
                          onClick={() => setShowSidebar(!showSidebar)}
                        >
                          <FontAwesomeIcon className='text-green-800' icon={faMessage} />
                        </button>
                      </div>
                      {chat.map((message, index) => (
                        <Message
                          key={index}
                          recieverId={message.sender === userId ? message.receiver : message.sender}
                          uniqueId={index === chat.length - 1 ? 'theLatestMessage' : `${index}`}
                          text={message.text}
                          timestamp={message.date}
                          type={message.type}
                          isUser={message.sender === userId}
                        />
                      ))}
                    </div>
                    {onEmoji && (
                      <div>
                        <EmojiPicker onEmojiClick={handleEmojiClick} lazyLoadEmojis={true} />
                      </div>
                    )}
                    {record &&
                      <div>
                        <AudioRecorder onSend={onAudioSubmit} />
                      </div>}
                    <div className="bg-gray-300  h-auto sticky w-full bottom-0  p-4 flex">
                      <input
                        value={message}
                        className="flex-grow rounded-l px-2 text-sm border border-gray-300 focus:outline-none"
                        type="text"
                        placeholder="Type your message…"
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <div
                        className="h-auto flex items-center justify-center px-2 bg-white border border-transparent"
                      // onClick={() => setOnEmoji(!onEmoji)}
                      >
                        <Dropzone onDrop={onDrop}>
                          {({ getRootProps, getInputProps }) => (
                            <section>
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Upload className="bg-white text-gray-300" />
                              </div>
                            </section>
                          )}
                        </Dropzone>
                        <h2>
                        </h2>
                      </div>
                      <div
                        className="h-auto flex items-center justify-center px-2 bg-white border border-transparent"
                        onClick={toggleRecordOption}
                      >
                        <h2>
                          <Mic className="bg-white text-gray-300" />
                        </h2>
                      </div>
                      <div
                        className="h-auto flex items-center justify-center px-2 bg-white border border-transparent"
                        onClick={() => setOnEmoji(!onEmoji)}
                      >
                        <h2>
                          <FontAwesomeIcon icon={faSmile} className="bg-white text-gray-300" />
                        </h2>
                      </div>
                      <button
                        className="bg-emerald-800 h-auto flex items-center justify-center text-white rounded-r p-2 md:p-3"
                        onClick={sendMessage}
                      >
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full flex-grow items-center justify-center w-full bg-white shadow-xl rounded-lg">
                  <h2 className="text-2xl">Select A User To Chat</h2>
                  <button
                    className="md:hidden bg-sky-100 rounded p-2"
                    onClick={() => setShowSidebar(!showSidebar)}
                  >
                    <FontAwesomeIcon className='text-green-800' icon={faMessage} />
                  </button>
                </div>
              )}
            </div>
  
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

export default ConsultentChat;
