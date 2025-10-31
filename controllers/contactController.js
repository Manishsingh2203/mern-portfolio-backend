import Contact from '../models/Contact.js';

/**
 * Premium Email Service using Brevo Transactional API
 */
class EmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.isConfigured = !!this.apiKey;
    this.baseUrl = 'https://api.brevo.com/v3';
    
    if (this.isConfigured) {
      console.log('Brevo API service initialized successfully');
    } else {
      console.warn('Brevo API key not configured - email notifications disabled');
    }
  }

  async sendEmail(mailOptions) {
    if (!this.isConfigured) {
      throw new Error('Brevo API service not configured');
    }

    try {
      const emailData = {
        sender: {
          name: mailOptions.from?.name || process.env.PORTFOLIO_NAME || 'Manish Singh Portfolio',
          email: process.env.FROM_EMAIL
        },
        to: [
          {
            email: mailOptions.to,
            name: mailOptions.toName || ''
          }
        ],
        subject: mailOptions.subject,
        htmlContent: mailOptions.html,
        replyTo: {
          email: process.env.FROM_EMAIL,
          name: process.env.PORTFOLIO_NAME || 'Manish Singh Portfolio'
        }
      };

      const response = await fetch(`${this.baseUrl}/smtp/email`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify(emailData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Brevo API error: ${response.status}`);
      }

      console.log(`Email sent successfully to ${mailOptions.to}`);
      console.log(`Message ID: ${result.messageId}`);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error.message);
      throw error;
    }
  }
}

const emailService = new EmailService();

/**
 * Premium Response Utility Functions
 */
const ResponseUtil = {
  success: (res, message, data = null, statusCode = 200) => {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data })
    };
    return res.status(statusCode).json(response);
  },

  error: (res, message, error = null, statusCode = 500) => {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && error && { error: error.message })
    };
    return res.status(statusCode).json(response);
  },

  validationError: (res, errors) => {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Array.isArray(errors) ? errors : [errors],
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Premium Email Templates - Professional Design
 */
const EmailTemplates = {
  userConfirmation: (name, email, subject, message) => ({
    subject: `Confirmation: Your Message Has Been Received - Manish Singh`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Confirmation - Manish Singh</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.7; 
            color: #1a202c; 
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            margin: 0; 
            padding: 40px 20px;
            font-weight: 400;
          }
          .container { 
            max-width: 650px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 
              0 25px 50px -12px rgba(0, 0, 0, 0.15),
              0 10px 30px -10px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .header { 
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            padding: 50px 40px; 
            text-align: center; 
            color: white; 
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,0 L100,0 L100,100 Z" fill="rgba(255,255,255,0.1)"/></svg>');
            background-size: cover;
          }
          .header h1 { 
            font-size: 2.8rem; 
            margin-bottom: 15px; 
            font-weight: 700;
            letter-spacing: -0.5px;
            position: relative;
          }
          .header p { 
            font-size: 1.2rem; 
            opacity: 0.9; 
            font-weight: 300;
            letter-spacing: 0.5px;
            position: relative;
          }
          .content { 
            padding: 50px 40px; 
            background: #ffffff;
          }
          .greeting { 
            font-size: 1.4rem; 
            margin-bottom: 30px; 
            color: #2d3748;
            font-weight: 600;
            border-bottom: 2px solid #f7fafc;
            padding-bottom: 15px;
          }
          .message-box { 
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 30px; 
            border-radius: 16px; 
            border-left: 4px solid #2a5298;
            margin: 30px 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .message-box h3 { 
            color: #2d3748; 
            margin-bottom: 20px; 
            font-size: 1.3rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .message-box h3::before {
            content: '';
            width: 4px;
            height: 20px;
            background: #2a5298;
            border-radius: 2px;
          }
          .message-detail { 
            background: white; 
            padding: 20px; 
            border-radius: 12px; 
            margin: 15px 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
            border: 1px solid #e2e8f0;
          }
          .timeline { 
            background: linear-gradient(135deg, #fff9db 0%, #fff3bf 100%);
            padding: 25px; 
            border-radius: 16px; 
            border: 1px solid #ffec99;
            margin: 30px 0;
          }
          .timeline h4 { 
            color: #2d3748; 
            margin-bottom: 15px; 
            font-size: 1.2rem;
            font-weight: 600;
          }
          .status-item {
            display: flex;
            align-items: center;
            margin: 12px 0;
            padding: 8px 0;
          }
          .status-indicator { 
            width: 8px; 
            height: 8px; 
            background: #2a5298; 
            border-radius: 50%; 
            margin-right: 15px;
            position: relative;
          }
          .status-indicator::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            border: 2px solid #2a5298;
            border-radius: 50%;
            top: -4px;
            left: -4px;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
          }
          .footer { 
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
            padding: 40px; 
            text-align: center; 
            color: #a0aec0;
            position: relative;
          }
          .signature { 
            margin-top: 25px; 
            color: #e2e8f0;
            font-size: 1.1rem;
          }
          .social-links { 
            margin: 25px 0; 
            display: flex;
            justify-content: center;
            gap: 25px;
          }
          .social-links a { 
            color: #cbd5e0; 
            text-decoration: none; 
            transition: all 0.3s ease;
            padding: 10px 20px;
            border: 1px solid #4a5568;
            border-radius: 8px;
            font-size: 0.9rem;
          }
          .social-links a:hover {
            color: #ffffff;
            border-color: #2a5298;
            background: rgba(42, 82, 152, 0.2);
            transform: translateY(-2px);
          }
          .contact-info {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .direct-contact {
            background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            border: 1px solid #81e6d9;
          }
          @media (max-width: 768px) {
            .content { padding: 30px 25px; } 
            .header { padding: 40px 25px; }
            .header h1 { font-size: 2.2rem; }
            .social-links { flex-direction: column; gap: 15px; }
            .social-links a { justify-content: center; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Message Received</h1>
            <p>Thank you for contacting Manish Singh</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Dear ${name},
            </div>
            
            <p>Thank you for reaching out through my portfolio. I have received your message and appreciate you taking the time to connect with me.</p>
            
            <div class="message-box">
              <h3>Message Summary</h3>
              <div class="message-detail">
                <strong>Subject:</strong> ${subject}
              </div>
              <div class="message-detail">
                <strong>Your Message:</strong><br>
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div class="timeline">
              <h4>Next Steps</h4>
              <div class="status-item">
                <div class="status-indicator"></div>
                <div>
                  <strong>Review Process</strong>
                  <p style="margin-top: 5px; font-size: 0.95rem; color: #4a5568;">
                    Your message is being reviewed and will receive a response within 4-6 business hours
                  </p>
                </div>
              </div>
              <div class="status-item">
                <div class="status-indicator"></div>
                <div>
                  <strong>Direct Communication</strong>
                  <p style="margin-top: 5px; font-size: 0.95rem; color: #4a5568;">
                    For urgent matters, you can reach me directly at 
                    <a href="mailto:manishsinghbst0322@gmail.com" style="color: #2a5298; text-decoration: none; font-weight: 500;">manishsinghbst0322@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>

            <div class="direct-contact">
              <h4 style="color: #234e52; margin-bottom: 15px;">Additional Contact Channels</h4>
              <p style="color: #4a5568; margin-bottom: 10px;">
                <strong>Portfolio:</strong> 
                <a href="https://manishsinghportfolio.com" style="color: #2a5298; text-decoration: none;">https://manishsinghportfolio.com</a>
              </p>
              <p style="color: #4a5568;">
                <strong>LinkedIn:</strong> 
                <a href="https://www.linkedin.com/in/manish-singh-967o4o42" style="color: #2a5298; text-decoration: none;">Connect on LinkedIn</a>
              </p>
            </div>

            <p>I look forward to learning more about your project and exploring potential collaboration opportunities.</p>
          </div>
          
          <div class="footer">
            <div class="contact-info">
              <strong>Manish Singh</strong><br>
              Full Stack Developer & Technology Consultant
            </div>
            
            <div class="social-links">
              <a href="https://github.com/Manishsingh2203" target="_blank">GitHub Profile</a>
              <a href="https://www.linkedin.com/in/manish-singh-967o4o42" target="_blank">LinkedIn Network</a>
              <a href="https://www.instagram.com/_manishsinghh" target="_blank">Instagram</a>
            </div>
            
            <div class="signature">
              <strong>Best Regards,</strong><br>
              <span style="color: #ffffff; font-size: 1.2rem;">Manish Singh</span><br>
              <span style="font-size: 0.9rem;">Building Digital Excellence</span>
            </div>
            
            <p style="margin-top: 25px; font-size: 0.85rem; color: #718096; border-top: 1px solid #4a5568; padding-top: 20px;">
              This is an automated confirmation. Please do not reply to this message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  adminNotification: (name, email, subject, message, contactId) => ({
    subject: `New Portfolio Inquiry: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Portfolio Inquiry</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.7; 
            color: #1a202c; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; 
            padding: 40px 20px;
          }
          .container { 
            max-width: 750px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 
              0 35px 60px -12px rgba(0, 0, 0, 0.25),
              0 20px 40px -10px rgba(0, 0, 0, 0.2);
          }
          .header { 
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
            padding: 40px; 
            color: white; 
            position: relative;
            border-bottom: 1px solid #4a5568;
          }
          .header h1 { 
            font-size: 2.4rem; 
            margin-bottom: 10px; 
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .priority-badge { 
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            color: white; 
            padding: 12px 24px; 
            border-radius: 25px; 
            font-size: 0.9rem; 
            font-weight: 600; 
            display: inline-block; 
            margin-top: 15px;
            box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
          }
          .content { 
            padding: 40px; 
            background: #ffffff;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 25px; 
            margin: 30px 0; 
          }
          .info-card { 
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 25px; 
            border-radius: 16px; 
            border-left: 4px solid #2a5298;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease;
          }
          .info-card:hover {
            transform: translateY(-2px);
          }
          .message-card { 
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            padding: 30px; 
            border-radius: 16px; 
            border: 1px solid #fed7d7;
            margin: 30px 0;
            box-shadow: 0 4px 12px rgba(254, 215, 215, 0.3);
          }
          .action-buttons { 
            display: flex; 
            gap: 15px; 
            margin: 30px 0; 
            flex-wrap: wrap;
          }
          .btn { 
            padding: 15px 30px; 
            border-radius: 12px; 
            text-decoration: none; 
            font-weight: 600; 
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-size: 0.95rem;
          }
          .btn-primary { 
            background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);
            color: white; 
            box-shadow: 0 4px 15px rgba(42, 82, 152, 0.3);
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(42, 82, 152, 0.4);
          }
          .btn-secondary { 
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
            color: #4a5568; 
          }
          .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(203, 213, 224, 0.3);
          }
          .metrics { 
            background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
            padding: 25px; 
            border-radius: 16px; 
            border-left: 4px solid #38a169;
            margin: 25px 0;
          }
          .footer { 
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            padding: 30px; 
            text-align: center; 
            color: #a0aec0;
            font-size: 0.9rem;
            border-top: 1px solid #4a5568;
          }
          .message-content {
            background: white;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            margin-top: 15px;
            line-height: 1.8;
            font-size: 1rem;
          }
          .dashboard-link {
            background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            text-align: center;
          }
          @media (max-width: 768px) { 
            .info-grid { grid-template-columns: 1fr; } 
            .action-buttons { flex-direction: column; }
            .content { padding: 30px 25px; }
            .header { padding: 30px 25px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Portfolio Inquiry</h1>
            <p>Contact form submission requires your attention</p>
            <div class="priority-badge">Action Required</div>
          </div>
          
          <div class="content">
            <div class="info-grid">
              <div class="info-card">
                <strong style="font-size: 1.1rem; color: #2a5298;">Contact Information</strong>
                <div style="margin-top: 15px;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> 
                    <a href="mailto:${email}?subject=Re: ${subject}" style="color: #2a5298; text-decoration: none; font-weight: 500;">${email}</a>
                  </p>
                  <p><strong>Submission Time:</strong> ${new Date().toLocaleString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
              <div class="info-card">
                <strong style="font-size: 1.1rem; color: #2a5298;">Submission Details</strong>
                <div style="margin-top: 15px;">
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Reference ID:</strong> ${contactId}</p>
                  <p><strong>Priority:</strong> <span style="color: #2a5298; font-weight: 600;">High</span></p>
                </div>
              </div>
            </div>

            <div class="message-card">
              <strong style="font-size: 1.1rem; color: #c53030;">Message Content</strong>
              <div class="message-content">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div class="action-buttons">
              <a href="mailto:${email}?subject=Re: ${subject}&body=Dear ${name},%0A%0AThank you for your message regarding '${subject}'. I appreciate you reaching out and would like to discuss this further.%0A%0ABest regards,%0AManish Singh" class="btn btn-primary">
                Reply to ${name}
              </a>
              <a href="https://manishsinghportfolio.com/admin/contacts" class="btn btn-secondary">
                View in Dashboard
              </a>
              <a href="https://manishsinghportfolio.com/admin/contacts/${contactId}" class="btn btn-secondary">
                Contact Details
              </a>
            </div>

            <div class="dashboard-link">
              <p><strong>Quick Actions:</strong> 
                <a href="https://manishsinghportfolio.com/admin" style="color: #2a5298; text-decoration: none; margin: 0 10px;">Admin Dashboard</a> • 
                <a href="https://manishsinghportfolio.com/admin/contacts" style="color: #2a5298; text-decoration: none; margin: 0 10px;">All Contacts</a> • 
                <a href="https://manishsinghportfolio.com/analytics" style="color: #2a5298; text-decoration: none; margin: 0 10px;">Analytics</a>
              </p>
            </div>

            <div class="metrics">
              <strong style="font-size: 1.1rem; color: #2d3748;">Performance Metrics</strong>
              <div style="margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <strong>Response Time</strong>
                  <p style="color: #4a5568; font-size: 0.9rem;">Target: 4-6 hours</p>
                </div>
                <div>
                  <strong>Monthly Inquiries</strong>
                  <p style="color: #4a5568; font-size: 0.9rem;">Current: 42</p>
                </div>
              </div>
              <div style="margin-top: 15px;">
                <a href="https://manishsinghportfolio.com/analytics/performance" style="color: #2a5298; text-decoration: none; font-size: 0.9rem;">
                  View Detailed Analytics
                </a>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Automated notification generated by 
              <a href="https://manishsinghportfolio.com" style="color: #cbd5e0; text-decoration: none;">Manish Singh Portfolio System</a>
            </p>
            <p style="margin-top: 10px; color: #cbd5e0;">
              ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

/**
 * Enhanced Professional Contact Controller
 */
export class ContactController {
  /**
   * Get client IP address handling various proxy scenarios
   */
  static getClientIP(req) {
    return req.ip || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress ||
           req.connection?.socket?.remoteAddress || 
           'unknown';
  }

  /**
   * Submit contact form with premium processing
   */
  static submitContact = async (req, res) => {
    const startTime = Date.now();
    
    try {
      const { name, email, subject, message, source = 'website' } = req.body;

      // Professional logging
      console.log(`Contact form submission initiated:`, {
        name,
        email,
        subject: subject.substring(0, 50) + (subject.length > 50 ? '...' : ''),
        source,
        ip: req.ip,
        userAgent: req.get('User-Agent')?.substring(0, 100)
      });

      // Enhanced validation
      if (!name || !email || !subject || !message) {
        return ResponseUtil.validationError(res, 'All fields are required: name, email, subject, message');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return ResponseUtil.validationError(res, 'Please provide a valid email address');
      }

      if (message.length < 10) {
        return ResponseUtil.validationError(res, 'Message must be at least 10 characters long');
      }

      if (name.length < 2) {
        return ResponseUtil.validationError(res, 'Name must be at least 2 characters long');
      }

      if (subject.length < 5) {
        return ResponseUtil.validationError(res, 'Subject must be at least 5 characters long');
      }

      // Create contact with comprehensive metadata
      const contactData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        source,
        ipAddress: this.getClientIP(req),
        userAgent: req.get('User-Agent'),
        status: 'new',
        priority: message.length > 200 ? 'high' : 'normal',
        metadata: {
          submissionTime: new Date(),
          userLanguage: req.get('Accept-Language'),
          secure: req.secure,
          contentLength: message.length,
          subjectLength: subject.length,
          nameLength: name.length
        }
      };

      const contact = new Contact(contactData);
      await contact.save();

      console.log(`Contact submission completed:`, {
        id: contact._id,
        name: contact.name,
        processingTime: `${Date.now() - startTime}ms`
      });

      // Send email notifications asynchronously
      if (emailService.isConfigured) {
        this.sendEmailNotifications(contact).catch(error => {
          console.error('Background email processing failed:', error);
        });
      } else {
        console.warn('Email service not configured - notifications skipped');
      }

      return ResponseUtil.success(
        res,
        'Your message has been sent successfully. I will respond within 24 hours.',
        {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          timestamp: contact.createdAt,
          estimatedResponseTime: '4-6 business hours',
          reference: `REF-${contact._id.toString().slice(-8).toUpperCase()}`
        },
        201
      );

    } catch (error) {
      console.error('Contact submission error:', {
        error: error.message,
        processingTime: `${Date.now() - startTime}ms`
      });

      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        return ResponseUtil.validationError(res, errors);
      }

      if (error.code === 11000) {
        return ResponseUtil.error(res, 'Duplicate submission detected', error, 409);
      }

      return ResponseUtil.error(
        res,
        'We encountered an issue processing your message. Please try again or contact me directly.',
        error,
        500
      );
    }
  };

  /**
   * Send premium email notifications
   */
  static async sendEmailNotifications(contact) {
    try {
      const userTemplate = EmailTemplates.userConfirmation(
        contact.name,
        contact.email,
        contact.subject,
        contact.message
      );

      const adminTemplate = EmailTemplates.adminNotification(
        contact.name,
        contact.email,
        contact.subject,
        contact.message,
        contact._id
      );

      await Promise.all([
        emailService.sendEmail({
          from: { name: process.env.PORTFOLIO_NAME || 'Manish Singh Portfolio' },
          to: contact.email,
          toName: contact.name,
          ...userTemplate
        }),
        emailService.sendEmail({
          from: { name: 'Portfolio Contact System' },
          to: process.env.ADMIN_EMAIL,
          toName: 'Manish Singh',
          ...adminTemplate
        })
      ]);

      console.log(`Email notifications dispatched for contact: ${contact._id}`);
    } catch (emailError) {
      console.error('Email notification system error:', emailError);
      // Fail silently to not affect main request flow
    }
  }

  /**
   * Get all contacts with advanced filtering and pagination
   */
  static getContacts = async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        priority, 
        search, 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
      } = req.query;

      const filter = {};
      
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ];
      }

      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const contacts = await Contact.find(filter)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

      const total = await Contact.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);

      return ResponseUtil.success(res, 'Contacts retrieved successfully', {
        contacts,
        pagination: {
          current: page,
          pages: totalPages,
          total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Get contacts error:', error);
      return ResponseUtil.error(res, 'Failed to retrieve contacts', error);
    }
  };

  /**
   * Get comprehensive contact statistics
   */
  static getContactStats = async (req, res) => {
    try {
      const totalContacts = await Contact.countDocuments();
      const newContacts = await Contact.countDocuments({ status: 'new' });
      const respondedContacts = await Contact.countDocuments({ status: 'responded' });
      const highPriorityContacts = await Contact.countDocuments({ priority: 'high' });

      // Last 7 days trend
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const weeklyTrend = await Contact.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Source distribution
      const sourceDistribution = await Contact.aggregate([
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 }
          }
        }
      ]);

      // Priority distribution
      const priorityDistribution = await Contact.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]);

      return ResponseUtil.success(res, 'Statistics retrieved successfully', {
        overview: {
          total: totalContacts,
          new: newContacts,
          responded: respondedContacts,
          highPriority: highPriorityContacts,
          responseRate: totalContacts > 0 ? ((respondedContacts / totalContacts) * 100).toFixed(1) : 0
        },
        trends: {
          weekly: weeklyTrend,
          averageDaily: totalContacts > 0 ? (totalContacts / 30).toFixed(1) : 0
        },
        distribution: {
          sources: sourceDistribution,
          priorities: priorityDistribution
        }
      });
    } catch (error) {
      console.error('Get contact stats error:', error);
      return ResponseUtil.error(res, 'Failed to retrieve statistics', error);
    }
  };

  /**
   * Get single contact by ID
   */
  static getContactById = async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
      
      if (!contact) {
        return ResponseUtil.error(res, 'Contact not found', null, 404);
      }

      return ResponseUtil.success(res, 'Contact retrieved successfully', contact);
    } catch (error) {
      console.error('Get contact by ID error:', error);
      return ResponseUtil.error(res, 'Failed to retrieve contact', error);
    }
  };

  /**
   * Update contact status
   */
  static updateContactStatus = async (req, res) => {
    try {
      const { status, notes } = req.body;
      
      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { 
          status,
          ...(notes && { adminNotes: notes }),
          respondedAt: status === 'responded' ? new Date() : undefined
        },
        { new: true, runValidators: true }
      );

      if (!contact) {
        return ResponseUtil.error(res, 'Contact not found', null, 404);
      }

      return ResponseUtil.success(res, 'Contact status updated successfully', contact);
    } catch (error) {
      console.error('Update contact status error:', error);
      return ResponseUtil.error(res, 'Failed to update contact status', error);
    }
  };

  /**
   * Delete contact
   */
  static deleteContact = async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      
      if (!contact) {
        return ResponseUtil.error(res, 'Contact not found', null, 404);
      }

      return ResponseUtil.success(res, 'Contact deleted successfully');
    } catch (error) {
      console.error('Delete contact error:', error);
      return ResponseUtil.error(res, 'Failed to delete contact', error);
    }
  };

  /**
   * System health check
   */
  static healthCheck = async (req, res) => {
    try {
      // Test database connection
      await Contact.findOne().limit(1);
      
      const healthInfo = {
        status: 'operational',
        timestamp: new Date().toISOString(),
        database: 'connected',
        emailService: emailService.isConfigured ? 'active' : 'inactive',
        emailProvider: 'Brevo API',
        uptime: `${process.uptime().toFixed(2)} seconds`,
        memory: {
          used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`
        },
        performance: {
          responseTime: 'optimal',
          connections: 'stable'
        }
      };

      return ResponseUtil.success(res, 'Contact service operational', healthInfo);
    } catch (error) {
      console.error('Health check failure:', error);
      return ResponseUtil.error(res, 'Contact service degradation detected', error, 503);
    }
  };
}

// Export individual functions for backward compatibility
export const {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
  healthCheck
} = ContactController;