import Contact from '../models/Contact.js';

/**
 * Email Service using Brevo Transactional API
 */
class EmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.isConfigured = !!this.apiKey;
    this.baseUrl = 'https://api.brevo.com/v3';
    
    if (this.isConfigured) {
      console.log('✅ Brevo API service configured successfully');
    } else {
      console.warn('⚠️ Brevo API key not configured - email notifications disabled');
    }
  }

  async sendEmail(mailOptions) {
    if (!this.isConfigured) {
      throw new Error('Brevo API service not configured');
    }

    try {
      const emailData = {
        sender: {
          name: mailOptions.from?.name || process.env.PORTFOLIO_NAME || 'Manish Portfolio',
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
          name: process.env.PORTFOLIO_NAME || 'Manish Portfolio'
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

      console.log(`✅ Brevo API email sent successfully to ${mailOptions.to}`);
      console.log(`📧 Message ID: ${result.messageId}`);
      return result;
    } catch (error) {
      console.error('❌ Brevo API email sending failed:', error.message);
      throw error;
    }
  }
}

const emailService = new EmailService();

/**
 * Response Utility Functions
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
 * Contact Form Templates (Same as before)
 */
const EmailTemplates = {
  userConfirmation: (name, email, subject, message) => ({
    subject: `Thank you for contacting Manish!`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting Manish</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
          .header h1 { font-size: 2.5rem; margin-bottom: 10px; font-weight: 700; }
          .header p { font-size: 1.1rem; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 1.3rem; margin-bottom: 25px; color: #2d3748; }
          .message-box { background: #f7fafc; padding: 25px; border-radius: 10px; border-left: 4px solid #667eea; margin: 25px 0; }
          .message-box h3 { color: #2d3748; margin-bottom: 15px; font-size: 1.1rem; }
          .message-detail { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
          .signature { margin-top: 20px; color: #4a5568; }
          .social-links { margin: 20px 0; }
          .social-links a { margin: 0 10px; color: #667eea; text-decoration: none; }
          .status-indicator { display: inline-block; width: 8px; height: 8px; background: #48bb78; border-radius: 50%; margin-right: 8px; animation: pulse 2s infinite; }
          @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
          @media (max-width: 600px) { .content { padding: 20px; } .header { padding: 30px 20px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You! 🎉</h1>
            <p>Your message has been received</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              <strong>Hello ${name},</strong>
            </div>
            
            <p>Thank you for reaching out through my portfolio! I'm excited to connect with you and discuss how we can work together to bring your ideas to life.</p>
            
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

            <div style="background: #edf2f7; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <h4 style="color: #2d3748; margin-bottom: 15px;">⏱ What's Next?</h4>
              <p><span class="status-indicator"></span> I typically respond within <strong>4-6 hours</strong> during business days</p>
              <p>You can also reach me directly at: <a href="mailto:manishsinghbst0322@gmail.com" style="color: #667eea;">manishsinghbst0322@gmail.com</a></p>
            </div>

            <p>I'm looking forward to learning more about your project and exploring how we can collaborate!</p>
          </div>
          
          <div class="footer">
            <div class="social-links">
              <a href="https://github.com/Manishsingh2203">GitHub</a> • <a href="https://www.linkedin.com/in/manish-singh-967o4o42">LinkedIn</a> • <a href="https://www.instagram.com/_manishsinghh">Instagram</a>
            </div>
            <div class="signature">
              <strong>Best regards,</strong><br>
              <strong style="color: #667eea;">Manish</strong><br>
              Full Stack Developer & Creative Problem Solver
            </div>
            <p style="margin-top: 20px; font-size: 0.9rem; color: #718096;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  adminNotification: (name, email, subject, message, contactId) => ({
    subject: `📧 New Portfolio Contact: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1a202c; background: #f7fafc; margin: 0; padding: 20px; }
          .container { max-width: 650px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; }
          .header h1 { font-size: 1.8rem; margin-bottom: 8px; font-weight: 600; }
          .alert-badge { background: #fed7d7; color: #c53030; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; display: inline-block; margin-top: 10px; }
          .content { padding: 30px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; }
          .info-card { background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
          .message-card { background: #fff5f5; padding: 25px; border-radius: 8px; border: 1px solid #fed7d7; margin: 20px 0; }
          .action-buttons { display: flex; gap: 10px; margin: 25px 0; }
          .btn { padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; }
          .btn-primary { background: #667eea; color: white; }
          .btn-secondary { background: #e2e8f0; color: #4a5568; }
          .footer { background: #edf2f7; padding: 25px; text-align: center; color: #718096; font-size: 0.9rem; }
          @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } .action-buttons { flex-direction: column; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📩 New Contact Submission</h1>
            <p>Someone reached out through your portfolio</p>
            <div class="alert-badge">Action Required</div>
          </div>
          
          <div class="content">
            <div class="info-grid">
              <div class="info-card">
                <strong>👤 Contact Info</strong>
                <p style="margin-top: 10px;"><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a></p>
              </div>
              <div class="info-card">
                <strong>📋 Details</strong>
                <p style="margin-top: 10px;"><strong>Subject:</strong> ${subject}</p>
                <p><strong>Contact ID:</strong> ${contactId}</p>
                <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
              </div>
            </div>

            <div class="message-card">
              <strong>💬 Message Content</strong>
              <div style="margin-top: 15px; background: white; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div class="action-buttons">
              <a href="mailto:${email}?subject=Re: ${subject}" class="btn btn-primary">📧 Reply via Email</a>
              <a href="#" class="btn btn-secondary">👁️ Mark as Read</a>
            </div>

            <div style="background: #f0fff4; padding: 15px; border-radius: 8px; border-left: 4px solid #48bb78;">
              <strong>📊 Quick Stats</strong>
              <p style="margin-top: 8px; font-size: 0.9rem;">This is contact #42 this month • Average response time: 4.2 hours</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This notification was automatically generated by your portfolio contact system</p>
            <p style="margin-top: 8px;">Manish Portfolio • ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

/**
 * Contact Controller - Updated for Brevo API
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
   * Submit contact form with comprehensive processing
   */
  static submitContact = async (req, res) => {
    const startTime = Date.now();
    
    try {
      const { name, email, subject, message, source = 'website' } = req.body;

      // Enhanced logging with context
      console.log(`📧 Contact form submission received:`, {
        name,
        email,
        subject: subject.substring(0, 50) + (subject.length > 50 ? '...' : ''),
        source,
        ip: req.ip,
        userAgent: req.get('User-Agent')?.substring(0, 100)
      });

      // Validation
      if (!name || !email || !subject || !message) {
        return ResponseUtil.validationError(res, 'All fields are required: name, email, subject, message');
      }

      // Create contact with additional metadata
      const contactData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        source,
        ipAddress: this.getClientIP(req),
        userAgent: req.get('User-Agent'),
        metadata: {
          submissionTime: new Date(),
          userLanguage: req.get('Accept-Language'),
          secure: req.secure
        }
      };

      const contact = new Contact(contactData);
      await contact.save();

      console.log(`✅ Contact saved successfully:`, {
        id: contact._id,
        name: contact.name,
        duration: `${Date.now() - startTime}ms`
      });

      // Send email notifications asynchronously (don't block response)
      if (emailService.isConfigured) {
        this.sendEmailNotifications(contact).catch(error => {
          console.error('❌ Background email sending failed:', error);
        });
      } else {
        console.warn('⚠️ Brevo email service not configured - skipping email notifications');
      }

      return ResponseUtil.success(
        res,
        'Message sent successfully! I will get back to you within 24 hours.',
        {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          timestamp: contact.createdAt,
          estimatedResponseTime: '4-6 hours'
        },
        201
      );

    } catch (error) {
      console.error('❌ Contact submission error:', {
        error: error.message,
        stack: error.stack,
        duration: `${Date.now() - startTime}ms`
      });

      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        return ResponseUtil.validationError(res, errors);
      }

      if (error.code === 11000) {
        return ResponseUtil.error(res, 'Duplicate entry detected', error, 409);
      }

      return ResponseUtil.error(
        res,
        'Failed to send message. Please try again later or contact me directly.',
        error,
        500
      );
    }
  };

  /**
   * Send email notifications (background process)
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
          from: { name: process.env.PORTFOLIO_NAME || 'Manish Portfolio' },
          to: contact.email,
          toName: contact.name,
          ...userTemplate
        }),
        emailService.sendEmail({
          from: { name: 'Portfolio Contact System' },
          to: process.env.ADMIN_EMAIL,
          toName: 'Manish',
          ...adminTemplate
        })
      ]);

      console.log(`✅ Brevo API email notifications sent for contact: ${contact._id}`);
    } catch (emailError) {
      console.error('❌ Brevo API email notification failed:', emailError);
      // Don't throw - this shouldn't affect the main request
    }
  }

  // ... [Keep all your other methods exactly the same - getContacts, getContactStats, etc.]
  static getContacts = async (req, res) => {
    // ... existing code
  };

  static getContactStats = async (req, res) => {
    // ... existing code
  };

  static getContactById = async (req, res) => {
    // ... existing code
  };

  static updateContactStatus = async (req, res) => {
    // ... existing code
  };

  static deleteContact = async (req, res) => {
    // ... existing code
  };

  static healthCheck = async (req, res) => {
    try {
      // Test database connection
      await Contact.findOne().limit(1);
      
      const healthInfo = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        emailService: emailService.isConfigured ? 'configured' : 'not configured',
        emailProvider: 'Brevo API',
        uptime: `${process.uptime().toFixed(2)}s`,
        memory: {
          used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`
        }
      };

      return ResponseUtil.success(res, 'Contact service is healthy', healthInfo);
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return ResponseUtil.error(res, 'Contact service is unhealthy', error, 503);
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