
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import VideoControls from '@/components/VideoControls';
import ParticipantsList from '@/components/ParticipantsList';
import ChatPanel from '@/components/ChatPanel';
import CallInvitationForm from '@/components/CallInvitationForm';
import useTwilioVideo from '@/hooks/useTwilioVideo';

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const roomId = searchParams.get('room') || 'demo-room';
  const token = searchParams.get('token');
  const [userId, setUserId] = useState<string>('anonymous');
  const [userName, setUserName] = useState<string>('Anonymous User');
  const [isDoctor, setIsDoctor] = useState(false);
  
  const [sidePanel, setSidePanel] = useState<'none' | 'chat' | 'participants' | 'invite'>('none');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(!!token);
  const [isTwilioLoaded, setIsTwilioLoaded] = useState(false);
  
  // Remote participant container refs
  const participantContainers = useRef<Record<string, HTMLDivElement>>({});
  
  // Load Twilio Video SDK
  useEffect(() => {
    const loadTwilioScript = () => {
      if (window.Twilio) {
        console.log("Twilio already loaded");
        setIsTwilioLoaded(true);
        return;
      }
      
      console.log("Loading Twilio Video script");
      const script = document.createElement('script');
      script.src = "https://sdk.twilio.com/js/video/releases/2.26.2/twilio-video.min.js";
      script.async = true;
      script.onload = () => {
        console.log("Twilio Video script loaded successfully");
        setIsTwilioLoaded(true);
      };
      script.onerror = (e) => {
        console.error("Error loading Twilio Video script:", e);
        toast({
          title: "Failed to load video service",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      };
      
      document.body.appendChild(script);
    };
    
    loadTwilioScript();
    
    // Clean up
    return () => {
      const existingScript = document.querySelector('script[src="https://sdk.twilio.com/js/video/releases/2.26.2/twilio-video.min.js"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [toast]);
  
  // Use our Twilio Video hook
  const {
    connect,
    disconnect,
    toggleMicrophone,
    toggleCamera,
    isConnecting,
    isConnected,
    isMicEnabled,
    isVideoEnabled,
    participants,
    localVideoRef,
    remoteParticipantRefs
  } = useTwilioVideo({ 
    roomId, 
    identity: userName 
  });

  // Validate invitation token if present
  useEffect(() => {
    if (token) {
      const validateToken = async () => {
        try {
          // For demo purposes, we use a simple base64 token
          // In production, use a more secure method
          const decodedToken = atob(token);
          const [tokenRoomId, email] = decodedToken.split(':');
          
          if (tokenRoomId !== roomId) {
            throw new Error('Invalid token for this room');
          }
          
          // Mark token as validated
          setIsValidatingToken(false);
        } catch (error) {
          console.error('Error validating token:', error);
          toast({
            title: "Invalid invitation link",
            description: "This invitation link is invalid or expired",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      };
      
      validateToken();
    } else {
      setIsValidatingToken(false);
    }
  }, [token, roomId, navigate, toast]);

  // Check authentication and get user details
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        
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
        navigate('/login', { state: { from: `/video?room=${roomId}${token ? `&token=${token}` : ''}` } });
      }
    };
    
    checkAuth();
  }, [navigate, roomId, token]);

  // Fetch session details
  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        // First try to find by ID if roomId is a UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        let sessionQuery = supabase
          .from('sessions')
          .select(`
            *,
            host: host_id (
              email,
              profiles (full_name, avatar_url)
            ),
            invitations(*)
          `);
          
        if (uuidRegex.test(roomId)) {
          sessionQuery = sessionQuery.eq('id', roomId);
        } else {
          // If not a UUID, use the roomId as is
          sessionQuery = sessionQuery.eq('id', roomId);
        }
        
        const { data: session } = await sessionQuery.single();
          
        if (session) {
          setSessionDetails(session);
        }
      } catch (error) {
        console.error('Error fetching session details:', error);
        // If no session found, we can still proceed with the video call
      }
    };
    
    if (roomId && !isValidatingToken && userId !== 'anonymous') {
      fetchSessionDetails();
    }
  }, [roomId, isValidatingToken, userId]);

  // Connect to the Twilio room when ready
  useEffect(() => {
    if (isValidatingToken || userId === 'anonymous' || !isTwilioLoaded) {
      console.log("Not ready to connect yet:", { isValidatingToken, userId, isTwilioLoaded });
      return;
    }
    
    // Connect to the Twilio room
    console.log("Ready to connect to Twilio room");
    connect();
    
    return () => {
      // Disconnect when component unmounts
      disconnect();
    };
  }, [isValidatingToken, userId, isTwilioLoaded, connect, disconnect]);

  const handleSendChatMessage = (content: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: userId,
      senderName: userName,
      content,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    // In a real application, you'd send this via Twilio DataTrack
    // or another messaging system
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
  
  const handleToggleSidePanel = (panel: 'chat' | 'participants' | 'invite') => {
    setSidePanel(prevPanel => prevPanel === panel ? 'none' : panel);
  };

  if (isValidatingToken) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      <p className="ml-3 text-lg">Validating invitation...</p>
    </div>;
  }

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
              <Button onClick={handleToggleFullscreen} variant="outline">
                {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              </Button>
              
              <Button onClick={() => handleToggleSidePanel('invite')} variant="outline">
                Invite
              </Button>
            </div>
          </div>
          
          <div className="flex h-[calc(100vh-13rem)] gap-6">
            <div className={`flex-1 ${sidePanel !== 'none' ? 'max-w-[calc(100%-21rem)]' : 'w-full'}`}>
              <div className="grid grid-cols-1 h-full">
                {/* Main video area - shows remote participant when connected */}
                <div className="bg-black rounded-xl overflow-hidden shadow-xl relative">
                  {participants.length > 0 ? (
                    <div 
                      ref={(el) => {
                        if (el) remoteParticipantRefs.current[participants[0].sid] = el;
                      }}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-white text-lg">Waiting for others to join...</p>
                    </div>
                  )}
                  
                  {/* Status indicator */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                    {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
                  </div>
                  
                  {/* Local video (smaller, positioned at the bottom right) */}
                  <div className="absolute bottom-4 right-4 w-40 h-32 bg-gray-800 rounded-lg overflow-hidden border border-white/20 shadow-xl">
                    <div className="w-full h-full">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {!isVideoEnabled && (
                        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                          <p className="text-white text-xs">Camera off</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Video controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                    <VideoControls 
                      isMicOn={isMicEnabled}
                      isVideoOn={isVideoEnabled}
                      isScreenSharing={false}  // We're not implementing screen sharing in this version
                      onToggleMic={toggleMicrophone}
                      onToggleVideo={toggleCamera}
                      onToggleScreenShare={() => {}}  // Placeholder for future implementation
                      onEndCall={() => {
                        disconnect();
                        navigate('/dashboard');
                      }}
                      onToggleChat={() => handleToggleSidePanel('chat')}
                      onToggleParticipants={() => handleToggleSidePanel('participants')}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Side panel */}
            {sidePanel !== 'none' && (
              <div className="w-80 h-full bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0">
                {sidePanel === 'chat' && (
                  <ChatPanel 
                    messages={chatMessages}
                    onSendMessage={handleSendChatMessage}
                    currentUserId={userId}
                  />
                )}
                {sidePanel === 'participants' && (
                  <ParticipantsList 
                    participants={participants.map(p => ({
                      id: p.sid,
                      name: p.identity,
                      isMuted: false, // We'd need to track this in a real implementation
                      isHost: false  // We'd need to track this in a real implementation
                    }))}
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
          
          {/* Session info tabs */}
          <div className="mt-6">
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Call Information</TabsTrigger>
                <TabsTrigger value="participants">
                  Participants ({participants.length + 1})
                </TabsTrigger>
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
                          className={`h-2 rounded-full ${isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: isConnected ? '100%' : isConnecting ? '50%' : '25%' }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {isConnecting ? 'Connecting' : isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="participants" className="p-4 bg-white rounded-lg shadow mt-2">
                <div className="space-y-2">
                  {/* Current User */}
                  <div className="flex items-center justify-between p-2 border-b">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <p>{userName} (You)</p>
                    </div>
                    <div className="flex items-center">
                      {!isMicEnabled && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          Muted
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Remote Participants */}
                  {participants.map((participant) => (
                    <div key={participant.sid} className="flex items-center justify-between p-2 border-b last:border-0">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <p>{participant.identity}</p>
                      </div>
                      <div className="flex items-center">
                        {/* We'd need to track participant mute state in a real implementation */}
                      </div>
                    </div>
                  ))}
                  
                  {participants.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No other participants yet</p>
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
