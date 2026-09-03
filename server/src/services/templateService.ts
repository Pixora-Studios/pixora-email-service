import { storageService, EmailTemplate } from './storageService';

const BUILT_IN_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl_appointment',
    name: 'Appointment Booking',
    slug: 'appointment-booking',
    description: 'Clinic & dental patient appointment notification email',
    subjectTemplate: 'New Appointment Booking - {{patientName}}',
    variables: [
      'clinicName',
      'patientName',
      'patientPhone',
      'patientEmail',
      'preferredDate',
      'preferredTime',
      'treatmentRequired',
      'additionalNotes',
    ],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; margin: 0; padding: 30px 15px; color: #f8fafc; }
    .card { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 14px; }
    .content { padding: 30px; }
    .info-row { display: flex; justify-content: space-between; border-bottom: 1px solid #334155; padding: 12px 0; }
    .info-label { color: #94a3b8; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-value { color: #f1f5f9; font-size: 14px; font-weight: 600; text-align: right; }
    .badge { display: inline-block; padding: 4px 10px; background: rgba(14, 165, 233, 0.15); color: #38bdf8; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .notes-box { margin-top: 20px; background: #0f172a; border-radius: 10px; padding: 16px; border: 1px solid #334155; }
    .notes-title { font-size: 12px; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; font-weight: 600; }
    .notes-content { font-size: 14px; color: #cbd5e1; line-height: 1.5; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #64748b; background: #182234; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Appointment Booking</h1>
      <p>{{clinicName}}</p>
    </div>
    <div class="content">
      <div class="info-row">
        <span class="info-label">Patient Name</span>
        <span class="info-value">{{patientName}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Phone Number</span>
        <span class="info-value">{{patientPhone}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email</span>
        <span class="info-value">{{patientEmail}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Preferred Date</span>
        <span class="info-value">{{preferredDate}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Preferred Time</span>
        <span class="info-value">{{preferredTime}}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Treatment</span>
        <span class="info-value"><span class="badge">{{treatmentRequired}}</span></span>
      </div>
      <div class="notes-box">
        <div class="notes-title">Additional Notes</div>
        <div class="notes-content">{{additionalNotes}}</div>
      </div>
    </div>
    <div class="footer">
      Powered by Pixora Studios Email Engine &bull; Automated Delivery
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'tpl_table_booking',
    name: 'Table Reservation',
    slug: 'table-booking',
    description: 'Café and restaurant table booking confirmation',
    subjectTemplate: 'New Table Reservation - {{guestName}} ({{guestCount}} Guests)',
    variables: [
      'restaurantName',
      'guestName',
      'guestPhone',
      'guestEmail',
      'reservationDate',
      'reservationTime',
      'guestCount',
      'seatingPreference',
      'specialRequests',
    ],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; margin: 0; padding: 30px 15px; color: #f8fafc; }
    .card { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
    .header { background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
    .header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 14px; }
    .content { padding: 30px; }
    .info-row { display: flex; justify-content: space-between; border-bottom: 1px solid #334155; padding: 12px 0; }
    .info-label { color: #94a3b8; font-size: 13px; font-weight: 500; }
    .info-value { color: #f1f5f9; font-size: 14px; font-weight: 600; }
    .badge { display: inline-block; padding: 4px 10px; background: rgba(245, 158, 11, 0.2); color: #fbbf24; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .notes-box { margin-top: 20px; background: #0f172a; border-radius: 10px; padding: 16px; border: 1px solid #334155; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #64748b; background: #182234; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Table Reservation Request</h1>
      <p>{{restaurantName}}</p>
    </div>
    <div class="content">
      <div class="info-row"><span class="info-label">Guest Name</span><span class="info-value">{{guestName}}</span></div>
      <div class="info-row"><span class="info-label">Phone</span><span class="info-value">{{guestPhone}}</span></div>
      <div class="info-row"><span class="info-label">Email</span><span class="info-value">{{guestEmail}}</span></div>
      <div class="info-row"><span class="info-label">Reservation Date</span><span class="info-value">{{reservationDate}}</span></div>
      <div class="info-row"><span class="info-label">Reservation Time</span><span class="info-value">{{reservationTime}}</span></div>
      <div class="info-row"><span class="info-label">Number of Guests</span><span class="info-value"><span class="badge">{{guestCount}} Guests</span></span></div>
      <div class="info-row"><span class="info-label">Seating Preference</span><span class="info-value">{{seatingPreference}}</span></div>
      <div class="notes-box">
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 6px; font-weight: 600;">SPECIAL REQUESTS</div>
        <div style="font-size: 14px; color: #cbd5e1;">{{specialRequests}}</div>
      </div>
    </div>
    <div class="footer">Powered by Pixora Studios Email Engine</div>
  </div>
</body>
</html>`,
  },
  {
    id: 'tpl_contact_inquiry',
    name: 'Website Contact Inquiry',
    slug: 'contact-inquiry',
    description: 'General inquiry form submissions from websites and landing pages',
    subjectTemplate: 'New Inquiry from {{senderName}} - {{websiteName}}',
    variables: [
      'websiteName',
      'senderName',
      'senderEmail',
      'senderPhone',
      'subject',
      'message',
    ],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; margin: 0; padding: 30px 15px; color: #f8fafc; }
    .card { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
    .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
    .header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 14px; }
    .content { padding: 30px; }
    .info-row { display: flex; justify-content: space-between; border-bottom: 1px solid #334155; padding: 12px 0; }
    .info-label { color: #94a3b8; font-size: 13px; font-weight: 500; }
    .info-value { color: #f1f5f9; font-size: 14px; font-weight: 600; }
    .message-box { margin-top: 20px; background: #0f172a; border-radius: 10px; padding: 18px; border: 1px solid #334155; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #64748b; background: #182234; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Website Lead</h1>
      <p>{{websiteName}}</p>
    </div>
    <div class="content">
      <div class="info-row"><span class="info-label">From</span><span class="info-value">{{senderName}}</span></div>
      <div class="info-row"><span class="info-label">Email</span><span class="info-value"><a href="mailto:{{senderEmail}}" style="color: #34d399; text-decoration: none;">{{senderEmail}}</a></span></div>
      <div class="info-row"><span class="info-label">Phone</span><span class="info-value">{{senderPhone}}</span></div>
      <div class="info-row"><span class="info-label">Subject</span><span class="info-value">{{subject}}</span></div>
      <div class="message-box">
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 8px; font-weight: 600;">MESSAGE</div>
        <div style="font-size: 14px; color: #cbd5e1; line-height: 1.6; white-space: pre-wrap;">{{message}}</div>
      </div>
    </div>
    <div class="footer">Powered by Pixora Studios Email Engine</div>
  </div>
</body>
</html>`,
  },
  {
    id: 'tpl_otp_verification',
    name: 'OTP / Security Code',
    slug: 'otp-verification',
    description: 'One-time password or security verification pin',
    subjectTemplate: 'Your Verification Code: {{otpCode}}',
    variables: ['appName', 'otpCode', 'expiresInMinutes', 'userEmail'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; margin: 0; padding: 30px 15px; color: #f8fafc; }
    .card { max-width: 500px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; text-align: center; }
    .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; color: #ffffff; }
    .content { padding: 35px 25px; }
    .otp-code { display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #f43f5e; background: #0f172a; padding: 15px 30px; border-radius: 12px; border: 2px dashed #f43f5e; margin: 25px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #64748b; background: #182234; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 style="margin:0; font-size:22px;">Verification Code</h1>
      <p style="margin:6px 0 0 0; opacity:0.9; font-size:14px;">{{appName}}</p>
    </div>
    <div class="content">
      <p style="color:#94a3b8; font-size:15px; margin:0;">Use this code to complete your verification.</p>
      <div class="otp-code">{{otpCode}}</div>
      <p style="color:#64748b; font-size:13px; margin:0;">This code will expire in {{expiresInMinutes}} minutes. Do not share this code with anyone.</p>
    </div>
    <div class="footer">Security alert from Pixora Studios</div>
  </div>
</body>
</html>`,
  },
  {
    id: 'tpl_general_notification',
    name: 'Universal Notification',
    slug: 'general-notification',
    description: 'General purpose transactional alert or message',
    subjectTemplate: '{{title}}',
    variables: ['title', 'subtitle', 'message', 'actionUrl', 'actionText', 'footerNote'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; margin: 0; padding: 30px 15px; color: #f8fafc; }
    .card { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
    .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center; color: #ffffff; }
    .content { padding: 30px; line-height: 1.6; }
    .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3b82f6, #6366f1); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #64748b; background: #182234; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 style="margin:0; font-size:24px;">{{title}}</h1>
      <p style="margin:8px 0 0 0; opacity:0.9; font-size:14px;">{{subtitle}}</p>
    </div>
    <div class="content">
      <div style="font-size:15px; color:#e2e8f0; white-space: pre-wrap;">{{message}}</div>
      <div style="text-align: center;">
        <a href="{{actionUrl}}" class="btn">{{actionText}}</a>
      </div>
      <p style="font-size:13px; color:#94a3b8; text-align: center;">{{footerNote}}</p>
    </div>
    <div class="footer">Pixora Studios Email Notification</div>
  </div>
</body>
</html>`,
  },
];

class TemplateService {
  constructor() {
    this.initDefaultTemplates();
  }

  private initDefaultTemplates() {
    const existing = storageService.getTemplates();
    const existingSlugs = new Set(existing.map((t) => t.slug));

    for (const tpl of BUILT_IN_TEMPLATES) {
      if (!existingSlugs.has(tpl.slug)) {
        storageService.upsertTemplate(tpl);
      }
    }
  }

  getAllTemplates(): EmailTemplate[] {
    return storageService.getTemplates();
  }

  getTemplateBySlug(slug: string): EmailTemplate | null {
    const templates = storageService.getTemplates();
    return templates.find((t) => t.slug === slug || t.id === slug) || null;
  }

  render(templateText: string, data: Record<string, any>): string {
    return templateText.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
      const val = data[key];
      if (val === undefined || val === null) {
        return '';
      }
      return String(val);
    });
  }

  renderTemplate(
    slug: string,
    data: Record<string, any>,
    subjectOverride?: string
  ): { subject: string; html: string; text: string } {
    const template = this.getTemplateBySlug(slug);
    if (!template) {
      throw new Error(`Template not found for slug: ${slug}`);
    }

    const subject = subjectOverride || this.render(template.subjectTemplate, data);
    const html = this.render(template.htmlContent, data);
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    return { subject, html, text };
  }
}

export const templateService = new TemplateService();
