
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Copy, Check } from 'lucide-react';

interface CallInvitationFormProps {
  sessionId: string;
  roomId: string;
  onInviteSent?: () => void;
}

const CallInvitationForm = ({ sessionId, roomId, onInviteSent }: CallInvitationFormProps) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();

  // Get the shareable URL for the meeting
  const getMeetingUrl = () => {
    return `${window.location.origin}/video?room=${roomId}`;
  };

  // Copy the meeting link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getMeetingUrl());
      setCopySuccess(true);
      toast({
        title: "Link copied to clipboard",
        duration: 2000,
      });
      
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Could not copy text: ', err);
      toast({
        title: "Failed to copy link",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Send invitation email through Supabase
  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSending(true);
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        toast({
          title: "Authentication required",
          description: "Please log in to send invitations",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }
      
      // Create invitation in database
      const { error } = await supabase
        .from('invitations')
        .insert([
          { 
            session_id: sessionId,
            sender_id: userId,
            recipient_email: email,
            personal_message: message,
          }
        ]);
      
      if (error) {
        console.error('Error creating invitation:', error);
        toast({
          title: "Failed to send invitation",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Invitation sent",
          description: `Invitation sent to ${email}`,
        });
        
        // Reset form
        setEmail('');
        setMessage('');
        
        // Callback
        if (onInviteSent) onInviteSent();
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Share meeting link</h3>
        <div className="flex">
          <Input 
            value={getMeetingUrl()} 
            readOnly 
            className="text-sm"
          />
          <Button 
            variant="outline" 
            className="ml-2 min-w-[80px]"
            onClick={copyLink}
            disabled={copySuccess}
          >
            {copySuccess ? (
              <Check className="h-4 w-4 mr-1" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            {copySuccess ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-2">Or send email invitation</h3>
        <form onSubmit={sendInvitation} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Personal message (optional)
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I'd like to meet with you..."
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSending || !email}
          >
            <Mail className="h-4 w-4 mr-2" />
            {isSending ? 'Sending...' : 'Send Invitation'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CallInvitationForm;
