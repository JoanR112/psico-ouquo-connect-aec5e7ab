
import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Declare the Twilio global type for TypeScript
declare global {
  interface Window {
    Twilio: any;
  }
}

// Define types for Twilio Video
type TwilioRoom = {
  disconnect: () => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  participants: Map<string, TwilioParticipant>;
  localParticipant: TwilioParticipant;
};

type TwilioParticipant = {
  identity: string;
  sid: string;
  audioTracks: Map<string, TwilioPublication>;
  videoTracks: Map<string, TwilioPublication>;
  tracks: Map<string, TwilioPublication>;
  on: (event: string, listener: (...args: any[]) => void) => void;
};

type TwilioPublication = {
  track: TwilioTrack;
  isSubscribed: boolean;
  on: (event: string, listener: (...args: any[]) => void) => void;
};

type TwilioTrack = {
  kind: string;
  attach: (element: HTMLMediaElement) => HTMLMediaElement;
  detach: (element?: HTMLMediaElement) => HTMLMediaElement[];
  disable: () => void;
  enable: () => void;
  isEnabled: boolean;
  on: (event: string, listener: (...args: any[]) => void) => void;
};

type UseTwilioVideoProps = {
  roomId: string;
  identity: string;
};

export const useTwilioVideo = ({ roomId, identity }: UseTwilioVideoProps) => {
  const { toast } = useToast();
  const [room, setRoom] = useState<TwilioRoom | null>(null);
  const [participants, setParticipants] = useState<TwilioParticipant[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteParticipantRefs = useRef<Record<string, HTMLDivElement>>({});
  
  // Get the Twilio Video token from our Edge Function
  const getVideoToken = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("twilio-token", {
        body: {
          roomName: roomId,
          identity
        }
      });

      if (error) throw error;
      return data.token;
    } catch (error) {
      console.error("Error getting Twilio token:", error);
      toast({
        title: "Error getting video token",
        description: "Could not connect to the video service. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [roomId, identity, toast]);

  // Attach local video to HTML element
  const attachLocalVideo = useCallback(async () => {
    if (!room || !localVideoRef.current) return;
    
    try {
      // Find the local participant's video track
      const localParticipant = room.localParticipant;
      
      if (!localParticipant) return;
      
      localParticipant.videoTracks.forEach((publication) => {
        if (publication.isSubscribed && publication.track) {
          // Pass HTMLVideoElement as argument to attach
          const videoElement = publication.track.attach(localVideoRef.current!);
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.objectFit = 'cover';
        }
      });
    } catch (error) {
      console.error("Error attaching local video:", error);
    }
  }, [room]);

  // Attach a remote participant's tracks to the DOM
  const attachParticipantTracks = useCallback((participant: TwilioParticipant, container: HTMLElement) => {
    if (!participant) return;
    
    // First remove any existing tracks
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Attach video tracks
    participant.videoTracks.forEach(publication => {
      if (publication.isSubscribed && publication.track) {
        // Create a new HTML video element for attachment
        const videoElement = document.createElement('video');
        publication.track.attach(videoElement);
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';
        container.appendChild(videoElement);
      }
    });
    
    // Attach audio tracks
    participant.audioTracks.forEach(publication => {
      if (publication.isSubscribed && publication.track) {
        // Create a new HTML audio element for attachment
        const audioElement = document.createElement('audio');
        publication.track.attach(audioElement);
        audioElement.style.display = 'none'; // Hide audio elements
        container.appendChild(audioElement);
      }
    });
  }, []);

  // Connect to the Twilio room
  const connect = useCallback(async () => {
    if (!roomId || isConnecting || room) return;
    
    const Video = window.Twilio?.Video;
    if (!Video) {
      toast({
        title: "Twilio library not loaded",
        description: "The video service library could not be loaded. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Get a token from our Edge Function
      const token = await getVideoToken();
      if (!token) throw new Error("Failed to get access token");
      
      // Connect to the Twilio Room
      const twilioRoom = await Video.connect(token, {
        name: roomId,
        audio: true,
        video: { width: 640, height: 480 },
        networkQuality: { local: 1, remote: 1 }
      });
      
      setRoom(twilioRoom);
      setIsConnected(true);
      
      // Add existing participants
      const participantsArray: TwilioParticipant[] = [];
      twilioRoom.participants.forEach(participant => {
        participantsArray.push(participant);
      });
      setParticipants(participantsArray);
      
      // Set up event listeners for room events
      twilioRoom.on('participantConnected', participant => {
        setParticipants(prevParticipants => [...prevParticipants, participant]);
        
        toast({
          title: "Participant joined",
          description: `${participant.identity} joined the call.`,
        });
      });
      
      twilioRoom.on('participantDisconnected', participant => {
        setParticipants(prevParticipants => 
          prevParticipants.filter(p => p.sid !== participant.sid)
        );
        
        toast({
          title: "Participant left",
          description: `${participant.identity} left the call.`,
        });
      });
      
      twilioRoom.on('disconnected', () => {
        setIsConnected(false);
        setRoom(null);
        
        toast({
          title: "Disconnected",
          description: "You have been disconnected from the call.",
        });
      });
      
      // Attach local video once connected
      attachLocalVideo();
    } catch (error) {
      console.error("Error connecting to Twilio room:", error);
      toast({
        title: "Connection error",
        description: "Failed to connect to the video call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  }, [roomId, isConnecting, room, toast, getVideoToken, attachLocalVideo]);

  // Disconnect from the Twilio room
  const disconnect = useCallback(() => {
    if (room) {
      room.disconnect();
      setRoom(null);
      setIsConnected(false);
      setParticipants([]);
    }
  }, [room]);

  // Toggle the microphone
  const toggleMicrophone = useCallback(() => {
    if (!room || !room.localParticipant) return;
    
    room.localParticipant.audioTracks.forEach(publication => {
      if (publication.track) {
        if (isMicEnabled) {
          publication.track.disable();
        } else {
          publication.track.enable();
        }
      }
    });
    
    setIsMicEnabled(!isMicEnabled);
    
    toast({
      title: isMicEnabled ? "Microphone off" : "Microphone on",
      duration: 1500,
    });
  }, [room, isMicEnabled, toast]);

  // Toggle the camera
  const toggleCamera = useCallback(() => {
    if (!room || !room.localParticipant) return;
    
    room.localParticipant.videoTracks.forEach(publication => {
      if (publication.track) {
        if (isVideoEnabled) {
          publication.track.disable();
        } else {
          publication.track.enable();
        }
      }
    });
    
    setIsVideoEnabled(!isVideoEnabled);
    
    toast({
      title: isVideoEnabled ? "Camera off" : "Camera on",
      duration: 1500,
    });
  }, [room, isVideoEnabled, toast]);

  // Effect to attach participant tracks when participants change
  useEffect(() => {
    if (!room) return;
    
    // Set up participant subscription handlers for all current participants
    participants.forEach(participant => {
      // Handle tracks that are already subscribed
      participant.tracks.forEach(publication => {
        if (publication.isSubscribed) {
          const container = remoteParticipantRefs.current[participant.sid];
          if (container) {
            attachParticipantTracks(participant, container);
          }
        }
      });
      
      // Set up listeners for track subscription events
      participant.on('trackSubscribed', track => {
        const container = remoteParticipantRefs.current[participant.sid];
        if (container && track) {
          if (track.kind === 'video') {
            const videoElement = document.createElement('video');
            track.attach(videoElement);
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            container.appendChild(videoElement);
          } else if (track.kind === 'audio') {
            const audioElement = document.createElement('audio');
            track.attach(audioElement);
            audioElement.style.display = 'none';
            container.appendChild(audioElement);
          }
        }
      });
    });
  }, [participants, attachParticipantTracks, room]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  return {
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
    remoteParticipantRefs,
    room
  };
};

export default useTwilioVideo;
