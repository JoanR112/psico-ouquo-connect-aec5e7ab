
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const VideoCall = () => {
  const { toast } = useToast();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Request access to user's camera and microphone
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        setLocalStream(stream);
        
        // Display the local video stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        toast({
          title: "Camera and microphone connected",
          description: "You can now start your video call.",
        });
      } catch (err) {
        console.error("Error accessing media devices:", err);
        toast({
          title: "Media access error",
          description: "Unable to access your camera or microphone. Please check your permissions.",
          variant: "destructive",
        });
      }
    };
    
    startMedia();
    
    // Cleanup function to stop all media tracks when component unmounts
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Toggle microphone
  const toggleMic = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(audioTracks[0]?.enabled || false);
      
      toast({
        title: audioTracks[0]?.enabled ? "Microphone turned on" : "Microphone turned off",
        duration: 1500,
      });
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(videoTracks[0]?.enabled || false);
      
      toast({
        title: videoTracks[0]?.enabled ? "Camera turned on" : "Camera turned off",
        duration: 1500,
      });
    }
  };

  // End the call
  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    toast({
      title: "Call ended",
      description: "You have disconnected from the video call.",
    });
    
    // In a real application, you would redirect to a post-call page
    // or show a call summary screen
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
                {/* Local video stream */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {!isVideoOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <p className="text-white text-lg">Camera is turned off</p>
                  </div>
                )}
                
                {/* Video controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white" 
                    onClick={toggleMic}
                  >
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    onClick={toggleVideo}
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="rounded-full"
                    onClick={endCall}
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Self view (picture-in-picture) */}
                {isVideoOn && (
                  <div className="absolute top-4 right-4 w-40 h-32 bg-gray-800 rounded-lg overflow-hidden border border-white/20 shadow-xl">
                    <video
                      ref={videoRef}
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
                  <span>Participants</span>
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
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Call Quality</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">Good</span>
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
