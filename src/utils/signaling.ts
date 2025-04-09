
// This is a simple mock signaling service for demonstration purposes.
// In a real application, you would use WebSockets or another real-time communication channel.

type SignalingCallback = (data: any) => void;
type SignalingCallbacks = {
  [key: string]: SignalingCallback[];
};

class SignalingService {
  private callbacks: SignalingCallbacks = {};
  private offers: Record<string, RTCSessionDescriptionInit> = {};
  private answers: Record<string, RTCSessionDescriptionInit> = {};
  private candidates: Record<string, RTCIceCandidateInit[]> = {};
  private rooms: Record<string, string[]> = {};

  constructor() {
    this.callbacks = {
      offer: [],
      answer: [],
      iceCandidate: [],
      userJoined: [],
      userLeft: [],
    };
  }

  // Register a callback for a specific event
  on(event: string, callback: SignalingCallback): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  // Trigger callbacks for a specific event
  private trigger(event: string, data: any): void {
    if (!this.callbacks[event]) return;
    this.callbacks[event].forEach(callback => callback(data));
  }

  // Join a room
  joinRoom(roomId: string, userId: string): void {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = [];
    }
    
    // Add user to room if not already in
    if (!this.rooms[roomId].includes(userId)) {
      this.rooms[roomId].push(userId);
    }
    
    // Notify others that a new user has joined
    this.trigger('userJoined', { roomId, userId });
    
    // If there's a stored offer for this room, send it to the new user
    if (this.offers[roomId]) {
      setTimeout(() => {
        this.trigger('offer', { 
          roomId, 
          userId: 'doctor', // In a real app, use proper user IDs
          offer: this.offers[roomId] 
        });
      }, 1000);
    }
  }

  // Leave a room
  leaveRoom(roomId: string, userId: string): void {
    if (this.rooms[roomId]) {
      this.rooms[roomId] = this.rooms[roomId].filter(id => id !== userId);
      this.trigger('userLeft', { roomId, userId });
    }
  }

  // Send an offer to a room
  sendOffer(roomId: string, userId: string, offer: RTCSessionDescriptionInit): void {
    this.offers[roomId] = offer;
    
    // Simulate sending to other users in the room
    setTimeout(() => {
      if (this.rooms[roomId] && this.rooms[roomId].length > 1) {
        this.trigger('offer', { roomId, userId, offer });
      }
    }, 500);
  }

  // Send an answer to a room
  sendAnswer(roomId: string, userId: string, answer: RTCSessionDescriptionInit): void {
    this.answers[roomId] = answer;
    
    // Simulate sending to the offerer
    setTimeout(() => {
      this.trigger('answer', { roomId, userId, answer });
    }, 500);
  }

  // Send an ICE candidate
  sendIceCandidate(roomId: string, userId: string, candidate: RTCIceCandidateInit): void {
    if (!this.candidates[roomId]) {
      this.candidates[roomId] = [];
    }
    this.candidates[roomId].push(candidate);
    
    // Simulate sending to other users
    setTimeout(() => {
      this.trigger('iceCandidate', { roomId, userId, candidate });
    }, 200);
  }

  // Get all users in a room
  getRoomUsers(roomId: string): string[] {
    return this.rooms[roomId] || [];
  }
}

// Create a singleton instance
export const signaling = new SignalingService();
