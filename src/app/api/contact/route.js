import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userType, name, email, message } = body;

    // Validate required fields
    if (!userType || !name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'unwritestudios@gmail.com',
        pass: 'lqry tccm hoza jkeo',
      },
    });

    // Email to admin
    const adminMailOptions = {
      from: 'unwritestudios@gmail.com',
      to: 'unwritestudios@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 30px;
            }
            .info-row {
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 1px solid #e0e0e0;
            }
            .info-row:last-child {
              border-bottom: none;
              margin-bottom: 0;
            }
            .label {
              font-size: 12px;
              text-transform: uppercase;
              color: #667eea;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .value {
              font-size: 16px;
              color: #333;
              line-height: 1.6;
            }
            .message-box {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #667eea;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #888;
              font-size: 14px;
            }
            .badge {
              display: inline-block;
              padding: 6px 12px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 20px;
              font-size: 14px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Contact Form Submission</h1>
            </div>
            
            <div class="content">
              <div class="info-row">
                <div class="label">User Type</div>
                <div class="value">
                  <span class="badge">${userType}</span>
                </div>
              </div>

              <div class="info-row">
                <div class="label">Name</div>
                <div class="value">${name}</div>
              </div>

              <div class="info-row">
                <div class="label">Email</div>
                <div class="value">
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </div>
              </div>

              <div class="info-row">
                <div class="label">Message</div>
                <div class="message-box">
                  <div class="value">${message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>This email was sent from your Unwrite Studios contact form</p>
              <p style="margin: 5px 0;">📧 Respond directly to: <strong>${email}</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Auto-reply email to user
    const userMailOptions = {
      from: 'unwritestudios@gmail.com',
      to: email,
      subject: 'Thank you for contacting Unwrite Studios',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
              font-weight: bold;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            .content p {
              color: #666;
              line-height: 1.8;
              font-size: 16px;
              margin-bottom: 15px;
            }
            .highlight {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-weight: bold;
            }
            .button {
              display: inline-block;
              padding: 14px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 25px;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              background: #f8f9fa;
              padding: 30px;
              text-align: center;
              color: #888;
              font-size: 14px;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              color: #667eea;
              text-decoration: none;
              margin: 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Thank You, ${name}!</h1>
            </div>
            
            <div class="content">
              <h2>We've received your message</h2>
              <p>
                Thank you for reaching out to <span class="highlight">Unwrite Studios</span>. 
                We're excited to learn more about your project!
              </p>
              <p>
                Our team will review your message and get back to you within <strong>24-48 hours</strong>. 
                In the meantime, feel free to explore our work and services.
              </p>
              <p>
                If you have any urgent queries, you can reach us directly at 
                <a href="mailto:hr.unwrite@gmail.com" style="color: #667eea; text-decoration: none;">
                  <strong>hr.unwrite@gmail.com</strong>
                </a>
              </p>
              
              <div style="text-align: center;">
                <a href="https://unwritestudios.com" class="button">Visit Our Website</a>
              </div>
            </div>

            <div class="footer">
              <p><strong>Unwrite Studios</strong></p>
              <p>Unwriting outdated systems, building meaningful experiences</p>
              <div class="social-links">
                <a href="mailto:hr.unwrite@gmail.com">Email</a> |
                <a href="https://unwritestudios.com">Website</a>
              </div>
              <p style="font-size: 12px; color: #aaa; margin-top: 20px;">
                This is an automated response. Please do not reply directly to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email. Please try again later.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
