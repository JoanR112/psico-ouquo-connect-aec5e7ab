
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Important: Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface for the request body
interface InvitationRequest {
  recipientEmail: string;
  meetingId: string;
  hostName: string;
  personalMessage?: string;
  scheduledTime?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, meetingId, hostName, personalMessage, scheduledTime } = await req.json() as InvitationRequest;
    
    // Create Supabase client with auth context from the request
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: req.headers.get("Authorization")! } },
      }
    );

    // Get user information from the token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate invitation link with base64 token for simplicity
    // In production, use a more secure method for generating tokens
    const token = btoa(`${meetingId}:${recipientEmail}:${Date.now()}`);
    const invitationLink = `${Deno.env.get("PUBLIC_APP_URL") || "http://localhost:5173"}/video?room=${meetingId}&token=${token}`;
    
    console.log(`Sending invitation to ${recipientEmail} for meeting ${meetingId}`);
    console.log(`Invitation link: ${invitationLink}`);

    // Format the email content
    const emailSubject = `${hostName} is inviting you to a video call`;
    
    // Simple HTML email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; 
                   border-radius: 4px; display: inline-block; font-weight: bold; }
          .message { border-left: 4px solid #E5E7EB; padding-left: 15px; margin: 20px 0; color: #6B7280; }
          .footer { margin-top: 30px; font-size: 12px; color: #9CA3AF; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Video Call Invitation</h2>
          <p>Hello,</p>
          <p><strong>${hostName}</strong> has invited you to join a video call.</p>
          
          ${scheduledTime ? `<p><strong>Scheduled for:</strong> ${scheduledTime}</p>` : ''}
          
          ${personalMessage ? 
            `<div class="message">
              <p>${personalMessage}</p>
            </div>` : ''}
          
          <p>
            <a href="${invitationLink}" class="button">Join Video Call</a>
          </p>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${invitationLink}</p>
          
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // In a real production app, you would send an actual email here
    // For this demo, we'll just simulate sending the email by storing the invitation in the database
    
    // Store the invitation in the database
    const { data: invitation, error: invitationError } = await supabaseClient
      .from("invitations")
      .insert({
        sender_id: user.id,
        session_id: meetingId,
        recipient_email: recipientEmail,
        personal_message: personalMessage || null,
        status: "sent"
      })
      .select()
      .single();

    if (invitationError) {
      console.error("Error storing invitation:", invitationError);
      return new Response(
        JSON.stringify({ error: "Failed to create invitation" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email via Email Service
    // This is a placeholder - in production you would use a service like SendGrid, AWS SES, etc.
    // For this demo, we'll simulate a successful email send
    console.log("Email content:", emailHtml);
    console.log("Sent to:", recipientEmail);
    console.log("Subject:", emailSubject);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invitation sent successfully",
        data: {
          invitationId: invitation.id,
          meetingId,
          recipientEmail,
          invitationLink
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
