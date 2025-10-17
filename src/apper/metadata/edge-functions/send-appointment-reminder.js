import apper from 'https://cdn.apper.io/actions/apper-actions.js';
import { Resend } from 'npm:resend';

apper.serve(async (req) => {
  try {
    const { appointmentId, patientEmail, patientName, doctorName, appointmentDate, appointmentTime, notificationType } = await req.json();

    if (!appointmentId || !patientEmail || !patientName || !doctorName || !appointmentDate || !appointmentTime) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: appointmentId, patientEmail, patientName, doctorName, appointmentDate, appointmentTime are required'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientEmail)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email address format'
        }),
        { 
          status: 422,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const resendApiKey = await apper.getSecret('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Resend API key not configured'
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const resend = new Resend(resendApiKey);

    let emailSubject, emailBody;
    
    if (notificationType === 'staff') {
      emailSubject = `Staff Notification: Upcoming Appointment - ${patientName}`;
      emailBody = `
        <h2>Upcoming Appointment Notification</h2>
        <p>Dear Medical Team,</p>
        <p>This is a notification about an upcoming appointment:</p>
        <ul>
          <li><strong>Patient:</strong> ${patientName}</li>
          <li><strong>Doctor:</strong> ${doctorName}</li>
          <li><strong>Date:</strong> ${appointmentDate}</li>
          <li><strong>Time:</strong> ${appointmentTime}</li>
          <li><strong>Appointment ID:</strong> ${appointmentId}</li>
        </ul>
        <p>Please ensure all necessary preparations are completed before the appointment.</p>
        <p>Best regards,<br>MediFlow System</p>
      `;
    } else if (notificationType === 'confirmation') {
      emailSubject = `Appointment Confirmation - ${appointmentDate}`;
      emailBody = `
        <h2>Appointment Confirmed</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment has been successfully scheduled:</p>
        <ul>
          <li><strong>Doctor:</strong> ${doctorName}</li>
          <li><strong>Date:</strong> ${appointmentDate}</li>
          <li><strong>Time:</strong> ${appointmentTime}</li>
          <li><strong>Appointment ID:</strong> ${appointmentId}</li>
        </ul>
        <p>Please arrive 15 minutes early for check-in.</p>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        <p>Best regards,<br>MediFlow Clinic</p>
      `;
    } else {
      emailSubject = `Appointment Reminder - ${appointmentDate}`;
      emailBody = `
        <h2>Upcoming Appointment Reminder</h2>
        <p>Dear ${patientName},</p>
        <p>This is a friendly reminder about your upcoming appointment:</p>
        <ul>
          <li><strong>Doctor:</strong> ${doctorName}</li>
          <li><strong>Date:</strong> ${appointmentDate}</li>
          <li><strong>Time:</strong> ${appointmentTime}</li>
          <li><strong>Appointment ID:</strong> ${appointmentId}</li>
        </ul>
        <p>Please arrive 15 minutes early for check-in.</p>
        <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
        <p>Best regards,<br>MediFlow Clinic</p>
      `;
    }

    try {
      const emailResponse = await resend.emails.send({
        from: 'MediFlow <noreply@mediflow.com>',
        to: [patientEmail],
        subject: emailSubject,
        html: emailBody
      });

      if (!emailResponse || !emailResponse.id) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to send email - no response from email service'
          }),
          { 
            status: 502,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Appointment reminder sent successfully',
          emailId: emailResponse.id,
          appointmentId: appointmentId
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );

    } catch (emailError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Email service error: ${emailError.message}`
        }),
        { 
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Server error: ${error.message}`
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});