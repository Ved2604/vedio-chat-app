import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import './App.css'

function App() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false)
  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('call', (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);

        call.on('stream', function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });

        call.on('close', () => {
          
          cleanup();
        });

        call.on('error', (error) => {
          
          console.error('Call error:', error);
          cleanup();
        });
      });
    });

    peerInstance.current = peer;

    return () => {
      
      peer.disconnect();
      peer.destroy();
    };
  }, []);

  const cleanup = () => {
    setIsCallEnded(true)
        const peer = peerInstance.current;
        const localStream = currentUserVideoRef.current.srcObject;
        const remoteStream = remoteVideoRef.current.srcObject;
    
        // Stop local and remote streams
        localStream.getTracks().forEach((track) => track.stop());
        remoteStream.getTracks().forEach((track) => track.stop());
    
        // Close the peer connection
        peer.destroy();
        
        // Reset media streams
        currentUserVideoRef.current.srcObject = null;
        remoteVideoRef.current.srcObject = null; 
  };

  const toggleMute = () => {
    const localStream = currentUserVideoRef.current.srcObject;
    const audioTracks = localStream.getAudioTracks();
    audioTracks.forEach((track) => {
      track.enabled = isMuted;
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    const localStream = currentUserVideoRef.current.srcObject;
    const videoTracks = localStream.getVideoTracks();
    videoTracks.forEach((track) => {
      track.enabled = isVideoStopped;
    });
    setIsVideoStopped(!isVideoStopped);
  };

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);



      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });

      call.on('close', () => {
        setIsCallEnded(true)
        const peer = peerInstance.current;
        const localStream = currentUserVideoRef.current.srcObject;
        const remoteStream = remoteVideoRef.current.srcObject;
    
        // Stop local and remote streams
        localStream.getTracks().forEach((track) => track.stop());
        remoteStream.getTracks().forEach((track) => track.stop());
    
        // Close the peer connection
        peer.destroy();
        
        // Reset media streams
        currentUserVideoRef.current.srcObject = null;
        remoteVideoRef.current.srcObject = null; 
    });

      call.on('error', (error) => {
        // Handle call error
        console.error('Call error:', error);
        cleanup();
      });
    });
  };
  const handleCloseCall = () => { 
    setIsCallEnded(true);
    const peer = peerInstance.current;
    const localStream = currentUserVideoRef.current.srcObject;
    const remoteStream = remoteVideoRef.current.srcObject;

    // Stop local and remote streams
    localStream.getTracks().forEach((track) => track.stop());
    remoteStream.getTracks().forEach((track) => track.stop());

    // Close the peer connection
    peer.destroy();
    call.close();
    // Reset media streams
    currentUserVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;

      // Update call status
  };

  if(!isCallEnded){
  return (
    <div className="App">
      <h3>Share this user id with your friend: {peerId}</h3> 
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
        placeholder="Enter remote peer ID"
      />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <div className="video-container">
        <video ref={currentUserVideoRef} />
        <video ref={remoteVideoRef} />
      </div>  
      <div className="controls-container">
          <button onClick={toggleMute} className='mute-button'>{isMuted ? 'Unmute' : 'Mute'} </button>
          <button onClick={toggleVideo} className='vedio-button'>
            {isVideoStopped ? 'Start Video' : 'Stop Video'} 
          </button>
          <button className="close-call-btn" onClick={handleCloseCall}>
        Close Call
      </button>
        </div>

      
    </div>
  );}
  else{
    return(
      <div className='call-ended '>
        <h1>Call has ended</h1>
      </div>
    )
  }
}

export default App;
