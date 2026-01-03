// Basic HTML template for registration confirmation
export function RegistrationEmailTemplate({
    userName,
    eventName,
    eventDate,
    venue,
    whatsappLink
}: {
    userName: string;
    eventName: string;
    eventDate: string;
    venue: string;
    whatsappLink?: string;
}) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registration Confirmed - ${eventName}</title>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; color: #333; line-height: 1.6; }
          .details { background: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #00d4ff; }
          .button { display: inline-block; padding: 12px 24px; background-color: #00d4ff; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Registration Confirmed! 🚀</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${userName}</strong>,</p>
            <p>You have successfully registered for <strong>${eventName}</strong> at TechnoHack 2026!</p>
            
            <div class="details">
              <p><strong>📅 Date:</strong> ${eventDate}</p>
              <p><strong>📍 Venue:</strong> ${venue}</p>
            </div>

            ${whatsappLink ? `
            <p>Don't miss out on important updates! Join the official WhatsApp group:</p>
            <a href="${whatsappLink}" class="button">Join WhatsApp Group</a>
            ` : ''}
            
            <p>See you there!</p>
            <p><em>The TechnoHack Team</em></p>
          </div>
          <div class="footer">
            <p>© 2026 TechnoHack. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `;
}
