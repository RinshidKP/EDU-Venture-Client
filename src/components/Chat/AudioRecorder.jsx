import { useState, useRef } from "react";
const AudioRecorder = ({onSend}) => {
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const [voice, setVoice] = useState(null);

    const mimeType = "audio/webm";
    const startRecording = async () => {
        setRecordingStatus("recording");
        const media = new MediaRecorder(stream, { type: mimeType });
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);
            setVoice(audioBlob)
            setAudioChunks([]);
        };
    };

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const handleSendClick = () => {
        console.log(voice);
          onSend(voice);
    }
    return (
        <div className="max-w-md mx-auto p-8 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6">Audio Recorder</h2>
            <main>
                <div className="mb-5 space-y-4">
                    {!permission ? (
                        <button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                            onClick={getMicrophonePermission}
                            type="button"
                        >
                            Get Microphone
                        </button>
                    ) : null}
                    {permission && recordingStatus === "inactive" ? (
                        <button
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                            onClick={startRecording}
                            type="button"
                        >
                            Start Recording
                        </button>
                    ) : null}
                    {recordingStatus === "recording" ? (
                        <button
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                            onClick={stopRecording}
                            type="button"
                        >
                            Stop Recording
                        </button>
                    ) : null}
                </div>
                {audio ? (
                    <div className="audio-container ">
                        <audio className="w-full" src={audio} controls></audio>
                        <div className="flex justify-evenly" >
                            <a
                                className="block mt-4 mx-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-center"
                                download
                                href={audio}
                            >
                                Download 
                            </a>
                            <a
                                className="block mt-4 mx-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-center"
                                onClick={handleSendClick}
                            >
                                Send Audio 
                            </a>
                        </div>
                    </div>
                ) : null}
            </main>
        </div>

    );
};
export default AudioRecorder;