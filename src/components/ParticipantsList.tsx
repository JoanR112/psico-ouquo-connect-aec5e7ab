
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Pin, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isHost: boolean;
  avatarUrl?: string;
}

interface ParticipantsListProps {
  participants: Participant[];
  onMuteParticipant?: (id: string, mute: boolean) => void;
  onPinParticipant?: (id: string) => void;
  onRemoveParticipant?: (id: string) => void;
  currentUserId: string;
}

const ParticipantsList = ({ 
  participants, 
  onMuteParticipant, 
  onPinParticipant,
  onRemoveParticipant,
  currentUserId 
}: ParticipantsListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="py-3 px-4 border-b">
        <h2 className="text-lg font-medium">Participants ({participants.length})</h2>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-2">
          {participants.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No participants</p>
          ) : (
            participants.map((participant) => (
              <div 
                key={participant.id} 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center">
                  {participant.avatarUrl ? (
                    <img 
                      src={participant.avatarUrl} 
                      alt={participant.name} 
                      className="h-8 w-8 rounded-full mr-3"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                      <span className="text-gray-600 text-sm font-medium">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{participant.name}</span>
                      {participant.isHost && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Host
                        </span>
                      )}
                      {participant.id === currentUserId && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {participant.isMuted ? (
                    <MicOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Mic className="h-4 w-4 text-gray-600" />
                  )}
                  
                  {(onPinParticipant || onMuteParticipant || onRemoveParticipant) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onPinParticipant && (
                          <DropdownMenuItem onClick={() => onPinParticipant(participant.id)}>
                            <Pin className="h-4 w-4 mr-2" /> Pin
                          </DropdownMenuItem>
                        )}
                        {onMuteParticipant && participant.id !== currentUserId && (
                          <DropdownMenuItem 
                            onClick={() => onMuteParticipant(participant.id, !participant.isMuted)}
                          >
                            {participant.isMuted ? (
                              <>
                                <Mic className="h-4 w-4 mr-2" /> Unmute
                              </>
                            ) : (
                              <>
                                <MicOff className="h-4 w-4 mr-2" /> Mute
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        {onRemoveParticipant && participant.id !== currentUserId && (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => onRemoveParticipant(participant.id)}
                          >
                            Remove
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ParticipantsList;
