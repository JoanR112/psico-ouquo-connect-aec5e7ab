
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, Clock, Plus, Video } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [newMeetingUrl, setNewMeetingUrl] = useState<string>('');

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      fetchSessions(session.user.id);
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch user's sessions
  const fetchSessions = async (userId: string) => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .or(`host_id.eq.${userId},invitations(recipient_email).eq.${user?.email}`)
      .order('scheduled_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Failed to load sessions",
        description: "Please try again later",
        variant: "destructive",
      });
    } else {
      setSessions(data || []);
    }
  };

  // Create a new video call session
  const createNewMeeting = async () => {
    const roomId = uuidv4();
    
    const { data, error } = await supabase
      .from('sessions')
      .insert([
        { 
          host_id: user.id,
          title: `Meeting with ${user.email}`,
          scheduled_at: new Date().toISOString(),
          duration: 30
        }
      ])
      .select();
      
    if (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Failed to create meeting",
        description: "Please try again later",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Meeting created",
        description: "Your meeting room is ready",
      });
      
      const shareableUrl = `${window.location.origin}/video?room=${roomId}`;
      setNewMeetingUrl(shareableUrl);
      
      // Refresh sessions list
      fetchSessions(user.id);
    }
  };

  // Join an existing session
  const joinSession = (sessionId: string, roomId: string) => {
    navigate(`/video?room=${roomId}`);
  };

  // Copy meeting link to clipboard
  const copyMeetingLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copied",
        description: "Meeting link copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.email}</h1>
            <p className="text-gray-600">Manage your video sessions and appointments</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled video appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Video className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p>You don't have any upcoming sessions</p>
                    <p className="text-sm mt-2">Create a new meeting to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h3 className="font-medium">{session.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <CalendarDays className="h-4 w-4 mr-1" />
                            <span>{new Date(session.scheduled_at).toLocaleString()}</span>
                            <Clock className="h-4 w-4 ml-3 mr-1" />
                            <span>{session.duration} min</span>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => copyMeetingLink(`${window.location.origin}/video?room=${session.id}`)}
                          >
                            Copy Link
                          </Button>
                          <Button onClick={() => joinSession(session.id, session.id)}>
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Create or join video meetings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Button 
                    className="w-full mb-4 flex items-center justify-center" 
                    onClick={createNewMeeting}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Meeting
                  </Button>
                  
                  {newMeetingUrl && (
                    <div className="bg-gray-50 p-3 rounded-md mt-4">
                      <p className="text-sm text-gray-600 mb-2">Meeting link:</p>
                      <div className="flex">
                        <Input value={newMeetingUrl} readOnly className="text-xs" />
                        <Button variant="ghost" className="ml-2" onClick={() => copyMeetingLink(newMeetingUrl)}>
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Join with code</h3>
                  <div className="flex">
                    <Input placeholder="Enter meeting code" />
                    <Button className="ml-2">Join</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Calls</CardTitle>
                <CardDescription>Your recent video call history</CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p>No recent calls</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sessions.slice(0, 5).map((session) => (
                      <div key={`history-${session.id}`} className="flex justify-between p-3 border-b last:border-0">
                        <div>
                          <h4 className="font-medium">{session.title}</h4>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(session.scheduled_at), { addSuffix: true })}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => joinSession(session.id, session.id)}>
                          Rejoin
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
