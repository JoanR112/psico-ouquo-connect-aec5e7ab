
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Clock, CalendarDays, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MeetingCardProps {
  id: string;
  title: string;
  scheduledAt: string;
  duration: number;
  onJoin: () => void;
}

const MeetingCard = ({ id, title, scheduledAt, duration, onJoin }: MeetingCardProps) => {
  const { toast } = useToast();
  const meetingUrl = `${window.location.origin}/video?room=${id}`;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const copyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      toast({
        title: "Link copied",
        description: "Meeting link copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium">{title}</h3>
            
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <CalendarDays className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{formatDate(scheduledAt)}</span>
            </div>
            
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{duration} minutes</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-2 rounded-full">
            <Video className="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-gray-50 flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1" 
          onClick={copyMeetingLink}
        >
          <Copy className="h-4 w-4 mr-1" />
          Copy Link
        </Button>
        
        <Button 
          size="sm" 
          className="flex-1" 
          onClick={onJoin}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Join
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MeetingCard;
