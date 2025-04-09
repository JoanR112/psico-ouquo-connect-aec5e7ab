
export interface PeerConnection {
  peerConnection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
}

export interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  offer: RTCSessionDescriptionInit | null;
  answer: RTCSessionDescriptionInit | null;
  peerConnection: RTCPeerConnection | null;
}

const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
};

// Create a peer connection
export const createPeerConnection = (): RTCPeerConnection => {
  const peerConnection = new RTCPeerConnection(configuration);
  
  // Log ICE candidates for debugging
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('New ICE candidate:', event.candidate);
    }
  };

  peerConnection.oniceconnectionstatechange = () => {
    console.log('ICE connection state:', peerConnection.iceConnectionState);
  };
  
  return peerConnection;
};

// Create an offer for the peer connection
export const createOffer = async (peerConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
};

// Create an answer for a received offer
export const createAnswer = async (peerConnection: RTCPeerConnection, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
};

// Add remote answer to peer connection
export const addAnswer = async (peerConnection: RTCPeerConnection, answer: RTCSessionDescriptionInit): Promise<void> => {
  if (!peerConnection.currentRemoteDescription) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }
};

// Add ICE candidate to peer connection
export const addIceCandidate = async (peerConnection: RTCPeerConnection, candidate: RTCIceCandidateInit): Promise<void> => {
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

// Add tracks from stream to peer connection
export const addTracksFromStream = (peerConnection: RTCPeerConnection, stream: MediaStream): void => {
  stream.getTracks().forEach(track => {
    peerConnection.addTrack(track, stream);
  });
};

// Clean up and close the peer connection
export const closePeerConnection = (peerConnection: RTCPeerConnection | null): void => {
  if (peerConnection) {
    peerConnection.ontrack = null;
    peerConnection.onicecandidate = null;
    peerConnection.oniceconnectionstatechange = null;
    peerConnection.close();
  }
};
