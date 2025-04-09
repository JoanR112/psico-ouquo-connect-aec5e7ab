
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWebRTC } from '@/hooks/useWebRTC';
import { signaling } from '@/utils/signaling';

const VideoCall = () => {
  // Room and user information (in a real app, these would come from auth and routing)
  const roomId = 'demo-room';
  const userId = 'patient';
  const isDoctor = false; // This would normally be determined by user role

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  
  // Initialize WebRTC hook
  const { 
    state, 
    refs: { localVideoRef, remoteVideoRef },
    actions: {
      initializeLocalStream,
      initializeCall,
      answerCall,
      completeCall,
      toggleMic,
      toggleVideo,
      endCall
    }
  } = useWebRTC();

  // Initialize media and join room
  useEffect(() => {
    const setupCall = async () => {
      await initializeLocalStream();
      
      // Join the signaling room
      signaling.joinRoom(roomId, userId);
      
      // Update participants
      setParticipants(signaling.getRoomUsers(roomId));
      
      // If doctor, initialize call when another user joins
      if (isDoctor) {
        signaling.on('userJoined', async ({ roomId: room }) => {
          if (room === roomId && !state.peerConnection) {
            const result = await initializeCall();
            if (result) {
              // Send offer through signaling
              signaling.sendOffer(roomId, userId, result.offer);
            }
          }
        });
      }
    };
    
    setupCall();
    
    // Clean up when component unmounts
    return () => {
      signaling.leaveRoom(roomId, userId);
      endCall();
    };
  }, []);
  
  // Handle signaling events
  useEffect(() => {
    // Handle incoming offers
    signaling.on('offer', async ({ roomId: room, offer }) => {
      if (room === roomId && !isDoctor) {
        const result = await answerCall(offer);
        if (result) {
          // Send answer back through signaling
          signaling.sendAnswer(roomId, userId, result.answer);
          setIsConnected(true);
        }
      }
    });
    
    // Handle incoming answers
    signaling.on('answer', async ({ roomId: room, answer }) => {
      if (room === roomId && isDoctor) {
        const success = await completeCall(answer);
        if (success) {
          setIsConnected(true);
        }
      }
    });
    
    // Handle users joining/leaving
    signaling.on('userJoined', ({ roomId: room }) => {
      if (room === roomId) {
        setParticipants(signaling.getRoomUsers(roomId));
      }
    });
    
    signaling.on('userLeft', ({ roomId: room }) => {
      if (room === roomId) {
        setParticipants(signaling.getRoomUsers(roomId));
        if (signaling.getRoomUsers(roomId).length <= 1) {
          setIsConnected(false);
        }
      }
    });
  }, [answerCall, completeCall, isDoctor]);

  // Handle microphone toggle
  const handleToggleMic = () => {
    const newState = toggleMic();
    setIsMicOn(newState);
  };

  // Handle video toggle
  const handleToggleVideo = () => {
    const newState = toggleVideo();
    setIsVideoOn(newState);
  };

  // Handle call end
  const handleEndCall = () => {
    endCall();
    signaling.leaveRoom(roomId, userId);
    setIsConnected(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-100 py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Video Session</h1>
            <p className="text-gray-600">Secure and private video therapy session</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main video area */}
            <div className="lg:col-span-3">
              <div className="bg-black rounded-xl overflow-hidden shadow-xl aspect-video relative">
                {/* Remote video stream (primary when connected) */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${isConnected ? 'block' : 'hidden'}`}
                />
                
                {/* Local video stream (primary when not connected) */}
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isConnected ? 'hidden' : 'block'}`}
                />
                
                {/* Video disabled indicator */}
                {!isVideoOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <p className="text-white text-lg">Camera is turned off</p>
                  </div>
                )}
                
                {/* Status indicator */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                  {isConnected ? 'Connected' : 'Waiting for connection...'}
                </div>
                
                {/* Video controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white" 
                    onClick={handleToggleMic}
                  >
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    onClick={handleToggleVideo}
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="rounded-full"
                    onClick={handleEndCall}
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Self view (picture-in-picture) - only show when connected */}
                {isConnected && isVideoOn && (
                  <div className="absolute top-4 right-4 w-40 h-32 bg-gray-800 rounded-lg overflow-hidden border border-white/20 shadow-xl">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Call info and tools */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat</span>
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Participants ({participants.length})</span>
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span>Notes</span>
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow p-4 h-full">
                <h2 className="font-medium text-gray-900 mb-4">Session Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                    <p className="text-gray-900">John Doe</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Therapist</h3>
                    <p className="text-gray-900">Dr. Sarah Johnson</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Session Type</h3>
                    <p className="text-gray-900">Individual Therapy</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                    <p className="text-gray-900">50 minutes</p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Connection Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} 
                          style={{ width: isConnected ? '100%' : '50%' }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{isConnected ? 'Connected' : 'Waiting'}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Participants</h3>
                    <div className="space-y-2">
                      {participants.map((participant, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${participant === 'doctor' ? 'bg-blue-500' : 'bg-green-500'} mr-2`}></div>
                          <p className="text-sm">{participant === 'doctor' ? 'Dr. Sarah Johnson' : 'John Doe'}</p>
                        </div>
                      ))}
                      {participants.length === 0 && (
                        <p className="text-sm text-gray-500">No participants yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VideoCall;
