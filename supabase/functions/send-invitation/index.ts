
// supabase/functions/send-invitation/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { recipientEmail, meetingId, hostName, personalMessage, scheduledTime } = await req.json();

    // Validate input
    if (!recipientEmail || !meetingId) {
      return new Response(
        JSON.stringify({ error: "Recipient email and meeting ID are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate a unique token for direct joining (simple approach for demo)
    const token = btoa(`${meetingId}:${recipientEmail}`);
    
    // Generate the meeting link with the token
    const meetingUrl = new URL(`/video`, req.url);
    meetingUrl.searchParams.set('room', meetingId);
    meetingUrl.searchParams.set('token', token);
    
    // Format scheduled time if provided
    let formattedTime = "";
    if (scheduledTime) {
      try {
        formattedTime = new Date(scheduledTime).toLocaleString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        });
      } catch (e) {
        console.error("Error formatting date:", e);
        formattedTime = scheduledTime;
      }
    }
    
    // Construct email content
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="padding: 20px; background-color: #f0f9ff; border-bottom: 3px solid #0ea5e9;">
          <h2 style="margin: 0; color: #0369a1;">Video Call Invitation</h2>
        </div>
        
        <div style="padding: 20px; background-color: #ffffff;">
          <p>Hello,</p>
          <p><strong>${hostName}</strong> has invited you to a video call${scheduledTime ? ' scheduled for:' : '.'}</p>
          
          ${scheduledTime ? `<p style="margin: 20px 0; padding: 15px; background-color: #f0f9ff; border-left: 3px solid #0ea5e9;"><strong>${formattedTime}</strong></p>` : ''}
          
          ${personalMessage ? `<div style="margin: 20px 0; padding: 15px; background-color: #f8f8f8; border-radius: 5px;"><p style="margin: 0;"><em>"${personalMessage}"</em></p></div>` : ''}
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${meetingUrl.toString()}" style="display: inline-block; padding: 12px 24px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Video Call</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 14px; word-break: break-all;"><a href="${meetingUrl.toString()}" style="color: #0ea5e9;">${meetingUrl.toString()}</a></p>
        </div>
        
        <div style="padding: 20px; background-color: #f8f8f8; font-size: 12px; color: #666; text-align: center;">
          <p>This invitation was sent through Psicome.</p>
        </div>
      </div>
    `;
    
    // In a real app we would actually send the email here
    // For this example, we'll just return success
    console.log(`Email invitation would be sent to ${recipientEmail} with URL ${meetingUrl}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Invitation sent to ${recipientEmail}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-invitation function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
