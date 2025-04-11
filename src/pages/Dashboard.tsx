
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, Plus, Video } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import MeetingCard from '@/components/MeetingCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [newMeetingUrl, setNewMeetingUrl] = useState<string>('');
  const [joinCode, setJoinCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      
      // Fetch user profile data to get role
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        setUser(prev => ({ ...prev, profile }));
      }
      
      await fetchSessions(session.user.id);
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  // Subscribe to real-time updates for sessions
  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase
      .channel('public:sessions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'sessions'
      }, () => {
        // Re-fetch sessions when changes occur
        fetchSessions(user.id);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Fetch user's sessions
  const fetchSessions = async (userId: string) => {
    try {
      // Fetch upcoming sessions (scheduled in the future)
      const { data: upcomingSessions, error: upcomingError } = await supabase
        .from('sessions')
        .select(`
          *,
          invitations(*)
        `)
        .or(`host_id.eq.${userId},invitations.recipient_email.eq.${user?.email}`)
        .gt('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true });
        
      if (upcomingError) throw upcomingError;
      
      // Fetch recent sessions (in the past)
      const { data: pastSessions, error: pastError } = await supabase
        .from('sessions')
        .select(`
          *,
          invitations(*)
        `)
        .or(`host_id.eq.${userId},invitations.recipient_email.eq.${user?.email}`)
        .lt('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: false })
        .limit(5);
        
      if (pastError) throw pastError;
      
      setSessions(upcomingSessions || []);
      setRecentCalls(pastSessions || []);
      
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Failed to load sessions",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Create a new video call session
  const createNewMeeting = async () => {
    const roomId = uuidv4();
    
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([
          { 
            host_id: user.id,
            title: `Meeting with ${user.email}`,
            scheduled_at: new Date().toISOString(),
            duration: 30,
            status: 'active'
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Meeting created",
        description: "Your meeting room is ready",
      });
      
      const shareableUrl = `${window.location.origin}/video?room=${roomId}`;
      setNewMeetingUrl(shareableUrl);
      
      // Refresh sessions list
      fetchSessions(user.id);
    } catch (error: any) {
      console.error('Error creating session:', error);
      toast({
        title: "Failed to create meeting",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Join an existing session
  const joinSession = (sessionId: string, roomId: string) => {
    navigate(`/video?room=${roomId || sessionId}`);
  };

  // Join a meeting by code
  const joinMeetingByCode = () => {
    if (!joinCode.trim()) {
      toast({
        title: "No meeting code",
        description: "Please enter a valid meeting code",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/video?room=${joinCode.trim()}`);
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
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.profile?.full_name || user?.email}</h1>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sessions.map((session) => (
                      <MeetingCard
                        key={session.id}
                        id={session.id}
                        title={session.title}
                        scheduledAt={session.scheduled_at}
                        duration={session.duration}
                        onJoin={() => joinSession(session.id, session.id)}
                      />
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
                    <Input 
                      placeholder="Enter meeting code" 
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                    <Button className="ml-2" onClick={joinMeetingByCode}>Join</Button>
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
                {recentCalls.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p>No recent calls</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentCalls.map((session) => (
                      <div key={`history-${session.id}`} className="flex justify-between p-3 border-b last:border-0">
                        <div>
                          <h4 className="font-medium">{session.title}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarDays className="h-4 w-4 mr-1" />
                            <span>{new Date(session.scheduled_at).toLocaleString()}</span>
                          </div>
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
