
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Import Twilio SDK
import twilio from 'https://esm.sh/twilio@4.19.0';

const Client = twilio;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get request body
    const { roomName, identity } = await req.json();

    // Validate input
    if (!roomName || !identity) {
      return new Response(
        JSON.stringify({ error: "Room name and identity are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get Twilio credentials from environment variables
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    
    if (!twilioAccountSid || !twilioAuthToken) {
      return new Response(
        JSON.stringify({ error: "Twilio credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const client = new Client(twilioAccountSid, twilioAuthToken);
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    // Create a Video grant for this specific room
    const videoGrant = new VideoGrant({
      room: roomName,
    });

    // Create an access token
    const token = new AccessToken(
      twilioAccountSid,
      Deno.env.get("TWILIO_API_KEY") || twilioAccountSid,
      Deno.env.get("TWILIO_API_SECRET") || twilioAuthToken,
      { identity }
    );

    // Add the video grant to the token
    token.addGrant(videoGrant);

    // Generate the token
    const accessToken = token.toJwt();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Try to create a Twilio room if it doesn't exist
    try {
      // Check if room exists first to avoid errors
      await client.video.v1.rooms(roomName).fetch();
    } catch (error) {
      // Room doesn't exist, create a new one
      try {
        const room = await client.video.v1.rooms.create({
          uniqueName: roomName,
          type: 'group', // Options: 'peer-to-peer', 'group', 'group-small'
          recordParticipantsOnConnect: false
        });
        
        // Update the session with the Twilio room SID
        // We're using the room name as session ID in our case
        await supabaseClient
          .from('sessions')
          .update({ twilio_room_sid: room.sid })
          .eq('id', roomName);
      } catch (roomError) {
        console.error("Error creating Twilio room:", roomError);
        // Continue even if room creation fails - it might already exist
      }
    }

    // Return the token
    return new Response(
      JSON.stringify({ 
        token: accessToken,
        roomName
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
