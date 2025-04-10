
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Settings, Share2, ScreenShare, Grid3X3, PictureInPicture2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VideoControlsProps {
  isMicOn: boolean;
  isVideoOn: boolean;
  isScreenSharing?: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare?: () => void;
  onEndCall: () => void;
  onToggleChat?: () => void;
  onToggleParticipants?: () => void;
  onToggleSettings?: () => void;
  onToggleLayout?: () => void;
}

const VideoControls = ({
  isMicOn,
  isVideoOn,
  isScreenSharing = false,
  onToggleMic,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
  onToggleChat,
  onToggleParticipants,
  onToggleSettings,
  onToggleLayout
}: VideoControlsProps) => {
  return (
    <TooltipProvider>
      <div className="flex justify-center space-x-2 md:space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white" 
              onClick={onToggleMic}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isMicOn ? 'Turn off microphone' : 'Turn on microphone'}
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
              onClick={onToggleVideo}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          </TooltipContent>
        </Tooltip>
        
        {onToggleScreenShare && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className={`rounded-full ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/10 border-white/20 hover:bg-white/20'} text-white`}
                onClick={onToggleScreenShare}
              >
                <ScreenShare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
            </TooltipContent>
          </Tooltip>
        )}
        
        {onToggleLayout && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
                onClick={onToggleLayout}
              >
                <Grid3X3 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Change layout
            </TooltipContent>
          </Tooltip>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full"
              onClick={onEndCall}
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            End call
          </TooltipContent>
        </Tooltip>
        
        {onToggleChat && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
                onClick={onToggleChat}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Open chat
            </TooltipContent>
          </Tooltip>
        )}
        
        {onToggleParticipants && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
                onClick={onToggleParticipants}
              >
                <Users className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Show participants
            </TooltipContent>
          </Tooltip>
        )}
        
        {onToggleSettings && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
                onClick={onToggleSettings}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Settings
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default VideoControls;
