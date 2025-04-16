
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Copy, Check, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatISO } from 'date-fns';

interface CallInvitationFormProps {
  sessionId: string;
  roomId: string;
  onInviteSent?: () => void;
}

const CallInvitationForm = ({ sessionId, roomId, onInviteSent }: CallInvitationFormProps) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(new Date());
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

  // Send invitation email through Supabase Edge Function
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
      
      // Get user profile for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      
      const hostName = profile?.full_name || session.user.email || 'A user';
      
      // Format scheduled date if provided
      let formattedDate: string | undefined;
      if (scheduledDate) {
        formattedDate = formatISO(scheduledDate);
      }
      
      // First, create or update the session record if needed
      let sessionRecord = sessionId;
      
      // If sessionId isn't a UUID, we might need to create a new session
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(sessionId)) {
        // Check if a session with this room ID already exists
        const { data: existingSession } = await supabase
          .from('sessions')
          .select('id')
          .eq('id', sessionId)
          .maybeSingle();
          
        if (!existingSession) {
          // Create a new session
          const { data: newSession, error } = await supabase
            .from('sessions')
            .insert({
              id: sessionId,  // Use the roomId as the session ID
              host_id: userId,
              title: `Call with ${email}`,
              scheduled_at: scheduledDate ? formattedDate : new Date().toISOString(),
              duration: 30,
              status: 'active'
            })
            .select('id')
            .single();
            
          if (error) throw new Error('Failed to create session');
          sessionRecord = newSession.id;
        } else {
          sessionRecord = existingSession.id;
        }
      }
      
      // Now create the invitation
      const { error: inviteError } = await supabase
        .from('invitations')
        .insert({
          session_id: sessionRecord,
          sender_id: userId,
          recipient_email: email,
          personal_message: message,
          status: 'sent'
        });
        
      if (inviteError) throw new Error('Failed to create invitation');
      
      // Call the edge function to send invitation email
      const { data, error } = await supabase.functions.invoke('send-invitation', {
        body: {
          recipientEmail: email,
          meetingId: roomId,
          hostName,
          personalMessage: message,
          scheduledTime: scheduledDate ? formattedDate : undefined
        }
      });

      if (error) {
        console.error('Error sending invitation:', error);
        throw new Error(error.message || 'Failed to send invitation');
      }
      
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${email}`,
      });
      
      // Reset form
      setEmail('');
      setMessage('');
      
      // Callback
      if (onInviteSent) onInviteSent();
      
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
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
            <label htmlFor="scheduled-time" className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled time (optional)
            </label>
            <div className="relative">
              <DatePicker
                selected={scheduledDate}
                onChange={(date) => setScheduledDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background"
                wrapperClassName="w-full"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none h-4 w-4" />
            </div>
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
