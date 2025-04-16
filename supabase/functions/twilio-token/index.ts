
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Import Twilio SDK
// Using a specific version that's compatible with Deno
import { Twilio } from "https://esm.sh/twilio@4.19.3"; 

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const twilioApiKey = Deno.env.get("TWILIO_API_KEY") || twilioAccountSid;
    const twilioApiSecret = Deno.env.get("TWILIO_API_SECRET") || twilioAuthToken;
    
    if (!twilioAccountSid || !twilioAuthToken) {
      return new Response(
        JSON.stringify({ error: "Twilio credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Creating Twilio client");
    const client = new Twilio(twilioAccountSid, twilioAuthToken);
    
    // Create access token
    const AccessToken = Twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;
    
    // Create a Video grant for this specific room
    const videoGrant = new VideoGrant({
      room: roomName,
    });

    // Create an access token
    const token = new AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret,
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
      console.log("Checking if room exists:", roomName);
      await client.video.v1.rooms(roomName).fetch();
      console.log("Room exists:", roomName);
    } catch (error) {
      // Room doesn't exist, create a new one
      try {
        console.log("Creating new room:", roomName);
        const room = await client.video.v1.rooms.create({
          uniqueName: roomName,
          type: 'group', // Options: 'peer-to-peer', 'group', 'group-small'
          recordParticipantsOnConnect: false
        });
        
        console.log("Created room with SID:", room.sid);
        
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
    console.log("Generated token for:", identity, "in room:", roomName);
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
    console.error("Error in twilio-token function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
