
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Monitor } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWebRTC } from '@/hooks/useWebRTC';
import { signaling } from '@/utils/signaling';
import { supabase } from '@/integrations/supabase/client';
import VideoControls from '@/components/VideoControls';
import ParticipantsList from '@/components/ParticipantsList';
import ChatPanel from '@/components/ChatPanel';
import CallInvitationForm from '@/components/CallInvitationForm';

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get('room') || 'demo-room';
  const [userId, setUserId] = useState<string>('anonymous');
  const [userName, setUserName] = useState<string>('Anonymous User');
  const [isDoctor, setIsDoctor] = useState(false);
  
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [sidePanel, setSidePanel] = useState<'none' | 'chat' | 'participants' | 'invite'>('none');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  
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
      endCall,
      startScreenShare,
      stopScreenShare
    }
  } = useWebRTC();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUserName(profile.full_name || session.user.email || 'User');
          setIsDoctor(profile.role === 'doctor' || profile.role === 'psychologist');
        } else {
          setUserName(session.user.email || 'User');
        }
      } else {
        // Redirect to login if not authenticated
        navigate('/login', { state: { from: `/video?room=${roomId}` } });
      }
    };
    
    checkAuth();
  }, [navigate, roomId]);

  // Fetch session details if it exists
  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        // Check if roomId corresponds to a session ID in the database
        const { data: session } = await supabase
          .from('sessions')
          .select(`
            *,
            host: host_id (
              email,
              profiles (full_name, avatar_url)
            )
          `)
          .eq('id', roomId)
          .single();
          
        if (session) {
          setSessionDetails(session);
        }
      } catch (error) {
        console.error('Error fetching session details:', error);
      }
    };
    
    if (roomId) {
      fetchSessionDetails();
    }
  }, [roomId]);

  useEffect(() => {
    const setupCall = async () => {
      await initializeLocalStream();
      
      signaling.joinRoom(roomId, userId);
      
      const roomUsers = signaling.getRoomUsers(roomId);
      setParticipants(roomUsers.map(id => ({
        id,
        name: id === userId ? userName : (id === 'doctor' ? 'Dr. Sarah Johnson' : 'John Doe'),
        isMuted: false,
        isHost: id === 'doctor',
      })));
      
      if (isDoctor) {
        signaling.on('userJoined', async ({ roomId: room }) => {
          if (room === roomId && !state.peerConnection) {
            const result = await initializeCall();
            if (result) {
              signaling.sendOffer(roomId, userId, result.offer);
            }
          }
        });
      }
    };
    
    if (userId !== 'anonymous') {
      setupCall();
    }
    
    return () => {
      signaling.leaveRoom(roomId, userId);
      endCall();
    };
  }, [roomId, userId, userName, isDoctor]);
  
  useEffect(() => {
    signaling.on('offer', async ({ roomId: room, offer }) => {
      if (room === roomId && !isDoctor) {
        const result = await answerCall(offer);
        if (result) {
          signaling.sendAnswer(roomId, userId, result.answer);
          setIsConnected(true);
        }
      }
    });
    
    signaling.on('answer', async ({ roomId: room, answer }) => {
      if (room === roomId && isDoctor) {
        const success = await completeCall(answer);
        if (success) {
          setIsConnected(true);
        }
      }
    });
    
    signaling.on('userJoined', ({ roomId: room, userId: joinedUserId }) => {
      if (room === roomId) {
        // Update participants list
        setParticipants(prev => {
          // Check if participant already exists
          if (prev.find(p => p.id === joinedUserId)) {
            return prev;
          }
          
          // Add new participant
          return [...prev, {
            id: joinedUserId,
            name: joinedUserId === 'doctor' ? 'Dr. Sarah Johnson' : 'John Doe',
            isMuted: false,
            isHost: joinedUserId === 'doctor',
          }];
        });
      }
    });
    
    signaling.on('userLeft', ({ roomId: room, userId: leftUserId }) => {
      if (room === roomId) {
        setParticipants(prev => prev.filter(p => p.id !== leftUserId));
        
        if (signaling.getRoomUsers(roomId).length <= 1) {
          setIsConnected(false);
        }
      }
    });
  }, [answerCall, completeCall, isDoctor, roomId]);

  const handleToggleMic = () => {
    const newState = toggleMic();
    setIsMicOn(newState);
  };

  const handleToggleVideo = () => {
    const newState = toggleVideo();
    setIsVideoOn(newState);
  };

  const handleToggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await startScreenShare();
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const handleEndCall = () => {
    endCall();
    signaling.leaveRoom(roomId, userId);
    setIsConnected(false);
    navigate('/dashboard');
  };

  const handleToggleSidePanel = (panel: 'chat' | 'participants' | 'invite') => {
    setSidePanel(prevPanel => prevPanel === panel ? 'none' : panel);
  };

  const handleSendChatMessage = (content: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: userId,
      senderName: userName,
      content,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    // In a real application, you'd send this to the other participants
    // via WebRTC data channel or Supabase Realtime
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-100 py-6 px-4">
        <div className="container mx-auto max-w-7xl h-full flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{sessionDetails?.title || 'Video Session'}</h1>
              <p className="text-gray-600">Room: {roomId}</p>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleToggleFullscreen} variant="outline" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              </Button>
              
              <Button onClick={() => handleToggleSidePanel('invite')} variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Invite
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-13rem)]">
            <div className={`${sidePanel !== 'none' ? 'lg:col-span-3' : 'lg:col-span-4'} h-full`}>
              <div className="bg-black rounded-xl overflow-hidden shadow-xl aspect-video h-full relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${isConnected ? 'block' : 'hidden'}`}
                />
                
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isConnected ? 'hidden' : 'block'}`}
                />
                
                {!isVideoOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <p className="text-white text-lg">Camera is turned off</p>
                  </div>
                )}
                
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                  {isConnected ? 'Connected' : 'Waiting for connection...'}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                  <VideoControls 
                    isMicOn={isMicOn}
                    isVideoOn={isVideoOn}
                    isScreenSharing={isScreenSharing}
                    onToggleMic={handleToggleMic}
                    onToggleVideo={handleToggleVideo}
                    onToggleScreenShare={handleToggleScreenShare}
                    onEndCall={handleEndCall}
                    onToggleChat={() => handleToggleSidePanel('chat')}
                    onToggleParticipants={() => handleToggleSidePanel('participants')}
                  />
                </div>
                
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
            </div>
            
            {sidePanel !== 'none' && (
              <div className="lg:col-span-1 h-full bg-white rounded-xl shadow-lg overflow-hidden">
                {sidePanel === 'chat' && (
                  <ChatPanel 
                    messages={chatMessages}
                    onSendMessage={handleSendChatMessage}
                    currentUserId={userId}
                  />
                )}
                {sidePanel === 'participants' && (
                  <ParticipantsList 
                    participants={participants}
                    currentUserId={userId}
                  />
                )}
                {sidePanel === 'invite' && (
                  <div className="p-4 h-full overflow-auto">
                    <h2 className="text-lg font-medium mb-4">Invite participants</h2>
                    <CallInvitationForm 
                      sessionId={roomId} 
                      roomId={roomId} 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Call Information</TabsTrigger>
                <TabsTrigger value="participants">Participants ({participants.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="p-4 bg-white rounded-lg shadow mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Session</h3>
                    <p className="text-gray-900">{sessionDetails?.title || 'Video Call'}</p>
                  </div>
                  
                  {sessionDetails && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Scheduled Time</h3>
                        <p className="text-gray-900">{new Date(sessionDetails.scheduled_at).toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                        <p className="text-gray-900">{sessionDetails.duration} minutes</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Host</h3>
                        <p className="text-gray-900">
                          {sessionDetails.host?.profiles?.full_name || sessionDetails.host?.email || 'Unknown'}
                        </p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Connection Status</h3>
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
                </div>
              </TabsContent>
              
              <TabsContent value="participants" className="p-4 bg-white rounded-lg shadow mt-2">
                <div className="space-y-2">
                  {participants.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b last:border-0">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${participant.id === userId ? 'bg-green-500' : 'bg-blue-500'} mr-2`}></div>
                        <p>{participant.name}</p>
                        {participant.isHost && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Host</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {participant.isMuted && <MicOff className="h-4 w-4 text-gray-500" />}
                      </div>
                    </div>
                  ))}
                  
                  {participants.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No participants yet</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VideoCall;
