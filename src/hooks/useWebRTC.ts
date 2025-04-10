
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  WebRTCState,
  createPeerConnection, 
  createOffer, 
  createAnswer, 
  addAnswer,
  addTracksFromStream,
  getScreenShareStream,
  stopScreenSharing,
  replaceTracks,
  createDataChannel
} from '@/utils/webRTC';

export const useWebRTC = () => {
  const { toast } = useToast();
  const [state, setState] = useState<WebRTCState>({
    localStream: null,
    remoteStream: null,
    screenStream: null,
    offer: null,
    answer: null,
    peerConnection: null,
  });
  
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize local media devices
  const initializeLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setState(prev => ({ ...prev, localStream: stream }));
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      toast({
        title: "Camera and microphone connected",
        description: "You can now start your video call.",
      });
      
      return stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      toast({
        title: "Media access error",
        description: "Unable to access your camera or microphone. Please check your permissions.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Initialize peer connection as the caller
  const initializeCall = useCallback(async () => {
    if (!state.localStream) return null;
    
    try {
      const peerConnection = createPeerConnection();
      
      // Set up remote stream
      const remoteStream = new MediaStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      
      // Create a data channel for chat
      dataChannelRef.current = createDataChannel(peerConnection, 'chat');
      
      // Listen for remote tracks
      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };
      
      // Listen for data channels
      peerConnection.ondatachannel = (event) => {
        const channel = event.channel;
        channel.onmessage = (e) => {
          console.log('Received message:', e.data);
          // Handle incoming messages
          try {
            const message = JSON.parse(e.data);
            // Here you would handle different message types
          } catch (err) {
            console.error('Error parsing message:', err);
          }
        };
      };
      
      // Add local tracks to peer connection
      addTracksFromStream(peerConnection, state.localStream);
      
      // Create an offer
      const offer = await createOffer(peerConnection);
      
      setState(prev => ({ 
        ...prev, 
        peerConnection, 
        offer, 
        remoteStream 
      }));
      
      toast({
        title: "Call initialized",
        description: "Waiting for other participant to join...",
      });
      
      return { peerConnection, offer };
    } catch (err) {
      console.error("Error initializing call:", err);
      toast({
        title: "Call initialization error",
        description: "Failed to start the call. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [state.localStream, toast]);

  // Answer an incoming call
  const answerCall = useCallback(async (incomingOffer: RTCSessionDescriptionInit) => {
    if (!state.localStream) return null;
    
    try {
      const peerConnection = createPeerConnection();
      
      // Set up remote stream
      const remoteStream = new MediaStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      
      // Listen for remote tracks
      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };
      
      // Listen for data channels
      peerConnection.ondatachannel = (event) => {
        dataChannelRef.current = event.channel;
        dataChannelRef.current.onmessage = (e) => {
          console.log('Received message:', e.data);
          // Handle incoming messages
          try {
            const message = JSON.parse(e.data);
            // Here you would handle different message types
          } catch (err) {
            console.error('Error parsing message:', err);
          }
        };
      };
      
      // Add local tracks to peer connection
      addTracksFromStream(peerConnection, state.localStream);
      
      // Create an answer
      const answer = await createAnswer(peerConnection, incomingOffer);
      
      setState(prev => ({ 
        ...prev, 
        peerConnection, 
        answer,
        remoteStream 
      }));
      
      toast({
        title: "Call answered",
        description: "You've joined the video call.",
      });
      
      return { peerConnection, answer };
    } catch (err) {
      console.error("Error answering call:", err);
      toast({
        title: "Call answer error",
        description: "Failed to answer the call. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [state.localStream, toast]);

  // Complete the call connection using the answer from the other peer
  const completeCall = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (!state.peerConnection) return false;
    
    try {
      await addAnswer(state.peerConnection, answer);
      toast({
        title: "Call connected",
        description: "You are now connected with the other participant.",
      });
      return true;
    } catch (err) {
      console.error("Error completing call:", err);
      toast({
        title: "Call connection error",
        description: "Failed to connect the call. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [state.peerConnection, toast]);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    if (!state.peerConnection || !state.localStream) return false;
    
    try {
      const screenStream = await getScreenShareStream();
      
      // Replace video track with screen sharing track
      replaceTracks(state.peerConnection, screenStream, state.localStream);
      
      setState(prev => ({ ...prev, screenStream }));
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }
      
      // Add event listener to detect when screen sharing stops
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
      
      toast({
        title: "Screen sharing started",
        description: "Your screen is now being shared.",
      });
      
      return true;
    } catch (err) {
      console.error("Error starting screen share:", err);
      toast({
        title: "Screen sharing error",
        description: "Failed to start screen sharing. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [state.peerConnection, state.localStream, toast]);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    if (!state.peerConnection || !state.localStream || !state.screenStream) return false;
    
    try {
      // Stop all screen sharing tracks
      stopScreenSharing(state.screenStream);
      
      // Re-initialize local camera stream
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: state.localStream.getAudioTracks().length > 0,
      });
      
      // Replace screen sharing track with camera track
      replaceTracks(state.peerConnection, newStream, state.screenStream);
      
      setState(prev => ({ 
        ...prev, 
        localStream: newStream, 
        screenStream: null 
      }));
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }
      
      toast({
        title: "Screen sharing stopped",
        description: "Returned to camera view.",
      });
      
      return true;
    } catch (err) {
      console.error("Error stopping screen share:", err);
      toast({
        title: "Screen sharing error",
        description: "Failed to stop screen sharing. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [state.peerConnection, state.localStream, state.screenStream, toast]);

  // Send a chat message
  const sendMessage = useCallback((message: string) => {
    if (!dataChannelRef.current || dataChannelRef.current.readyState !== 'open') {
      toast({
        title: "Chat unavailable",
        description: "Chat connection is not established.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      dataChannelRef.current.send(JSON.stringify({
        type: 'chat',
        content: message,
        timestamp: new Date().toISOString()
      }));
      return true;
    } catch (err) {
      console.error("Error sending message:", err);
      toast({
        title: "Message sending failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Toggle microphone
  const toggleMic = useCallback(() => {
    if (state.localStream) {
      const audioTracks = state.localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      
      toast({
        title: audioTracks[0]?.enabled ? "Microphone turned on" : "Microphone turned off",
        duration: 1500,
      });
      
      return audioTracks[0]?.enabled || false;
    }
    return false;
  }, [state.localStream, toast]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (state.localStream) {
      const videoTracks = state.localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      
      toast({
        title: videoTracks[0]?.enabled ? "Camera turned on" : "Camera turned off",
        duration: 1500,
      });
      
      return videoTracks[0]?.enabled || false;
    }
    return false;
  }, [state.localStream, toast]);

  // End the call
  const endCall = useCallback(() => {
    // Stop all tracks in the local stream
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => track.stop());
    }
    
    // Stop screen sharing if active
    if (state.screenStream) {
      state.screenStream.getTracks().forEach(track => track.stop());
    }
    
    // Close data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    
    // Close peer connection
    if (state.peerConnection) {
      state.peerConnection.close();
    }
    
    // Reset state
    setState({
      localStream: null,
      remoteStream: null,
      screenStream: null,
      offer: null,
      answer: null,
      peerConnection: null,
    });
    
    toast({
      title: "Call ended",
      description: "You have disconnected from the video call.",
    });
  }, [state.localStream, state.peerConnection, state.screenStream, toast]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (state.localStream) {
        state.localStream.getTracks().forEach(track => track.stop());
      }
      
      if (state.screenStream) {
        state.screenStream.getTracks().forEach(track => track.stop());
      }
      
      if (dataChannelRef.current) {
        dataChannelRef.current.close();
      }
      
      if (state.peerConnection) {
        state.peerConnection.close();
      }
    };
  }, [state.localStream, state.peerConnection, state.screenStream]);

  return {
    state,
    refs: {
      localVideoRef,
      remoteVideoRef,
    },
    actions: {
      initializeLocalStream,
      initializeCall,
      answerCall,
      completeCall,
      toggleMic,
      toggleVideo,
      startScreenShare,
      stopScreenShare,
      sendMessage,
      endCall,
    }
  };
};
