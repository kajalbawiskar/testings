import React, { useRef, useEffect } from 'react';

const VideoCallPage = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startVideoCall = async () => {
      try {
        // Prompt the user to share their screen
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        // Get user media (camera and microphone)
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Combine the screen stream and user stream
        const combinedStream = new MediaStream([
          ...screenStream.getTracks(),
          ...userStream.getTracks(),
        ]);

        // Set the combined stream to the video element
        videoRef.current.srcObject = combinedStream;
        videoRef.current.play();
      } catch (error) {
        console.error('Error starting video call:', error);
      }
    };

    startVideoCall();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4">
        <h1 className="text-2xl font-semibold mb-4">Live Video Call & Screen Sharing</h1>
        <video ref={videoRef} className="w-full h-auto rounded-lg" autoPlay controls />
      </div>
    </div>
  );
};

export default VideoCallPage;
