
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  WebRTCState,
  createPeerConnection, 
  createOffer, 
  createAnswer, 
  addAnswer,
  addTracksFromStream
} from '@/utils/webRTC';

export const useWebRTC = () => {
  const { toast } = useToast();
  const [state, setState] = useState<WebRTCState>({
    localStream: null,
    remoteStream: null,
    offer: null,
    answer: null,
    peerConnection: null,
  });

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
    if (!state.localStream) return;
    
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
      
      // In a real app, you would send this offer to the other peer
      console.log("Call offer created:", offer);
      
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
    if (!state.localStream) return;
    
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
      
      // In a real app, you would send this answer to the other peer
      console.log("Call answer created:", answer);
      
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
    
    // Close peer connection
    if (state.peerConnection) {
      state.peerConnection.close();
    }
    
    // Reset state
    setState({
      localStream: null,
      remoteStream: null,
      offer: null,
      answer: null,
      peerConnection: null,
    });
    
    toast({
      title: "Call ended",
      description: "You have disconnected from the video call.",
    });
  }, [state.localStream, state.peerConnection, toast]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (state.localStream) {
        state.localStream.getTracks().forEach(track => track.stop());
      }
      
      if (state.peerConnection) {
        state.peerConnection.close();
      }
    };
  }, [state.localStream, state.peerConnection]);

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
      endCall,
    }
  };
};
