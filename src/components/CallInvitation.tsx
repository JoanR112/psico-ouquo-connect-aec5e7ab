
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signaling, Invitation } from '@/utils/signaling';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff } from 'lucide-react';

export const CallInvitation = () => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAccept = () => {
    if (invitation) {
      signaling.acceptInvitation(invitation.id);
      setOpen(false);
      toast({
        title: "Call accepted",
        description: "Joining video call..."
      });
      
      // Navigate to the video call page
      navigate(`/video?room=${invitation.roomId}`);
    }
  };

  const handleDecline = () => {
    if (invitation) {
      signaling.declineInvitation(invitation.id);
      setOpen(false);
      toast({
        title: "Call declined",
        description: "You declined the call invitation"
      });
    }
  };

  useEffect(() => {
    // Listen for incoming call invitations
    const handleInvitation = (newInvitation: Invitation) => {
      setInvitation(newInvitation);
      setOpen(true);
    };

    // Get user ID (in a real app, this would come from authentication)
    const currentUserId = 'patient'; // Mock user ID
    
    // Register for invitation events
    signaling.on('invitation', handleInvitation);
    
    // Check for any pending invitations on component mount
    const pendingInvitations = signaling.getPendingInvitations(currentUserId);
    if (pendingInvitations.length > 0) {
      setInvitation(pendingInvitations[0]);
      setOpen(true);
    }

    return () => {
      // Clean up would happen here in a real implementation
    };
  }, [navigate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Incoming Video Call</DialogTitle>
          <DialogDescription>
            {invitation?.from === 'doctor' 
              ? 'Dr. Sarah Johnson is calling you' 
              : `${invitation?.from || 'Someone'} is calling you`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          <div className="bg-blue-100 rounded-full p-6 animate-pulse">
            <Phone className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-center gap-4">
          <Button 
            variant="destructive" 
            onClick={handleDecline}
            className="flex-1 sm:flex-initial"
          >
            <PhoneOff className="mr-2 h-4 w-4" /> 
            Decline
          </Button>
          <Button 
            variant="default" 
            onClick={handleAccept}
            className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700"
          >
            <Phone className="mr-2 h-4 w-4" /> 
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallInvitation;
