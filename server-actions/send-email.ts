"use server";

import { MAIL } from "@/data/config";
import nodemailer from "nodemailer";

type SendEmailParams = {
  to: string;
  subject: string;
  body: string;
  html?: string;
  attachments?: {
    filename?: string;
    content?: Buffer | string;
    contentType?: string;
  }[];
};

// Create a nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: MAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

/**
 * Sends an email using nodemailer with Gmail
 *
 * @param params Object containing email recipient, subject, body content, and optional HTML/attachments
 * @returns Promise resolving to success boolean and message
 */
const sendEmail = async (params: SendEmailParams) => {
  try {
    const { to, subject, body, html, attachments } = params;
    // if (process.env.NODE_ENV === "development") {
    //   return {
    //     success: true,
    //     message: "Email sent successfully",
    //   };
    // }

    // Send email using nodemailer
    await transporter.sendMail({
      from: MAIL,
      to,
      subject,
      text: body,
      html: html || body.replace(/\n/g, "<br>"),
      attachments,
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      message: "Failed to send email",
    };
  }
};

export const sendContactFormEmail = async (formData: {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  message?: string;
}) => {
  try {
    // Format the admin notification email
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #18A07B; border-bottom: 2px solid #18A07B; padding-bottom: 10px;">New Contact Form Submission</h2>
        
        <div style="margin: 20px 0; background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Contact Information:</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666; width: 140px;">Name:</td>
              <td style="padding: 8px 0; color: #333;">${formData.firstname} ${formData.lastname}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
              <td style="padding: 8px 0; color: #333;">
                <a href="mailto:${formData.email}" style="color: #18A07B; text-decoration: none;">${formData.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Phone:</td>
              <td style="padding: 8px 0; color: #333;">
                <a href="tel:${formData.phone}" style="color: #18A07B; text-decoration: none;">${formData.phone}</a>
              </td>
            </tr>
          </table>
        </div>
        
        ${formData.message ? `
        <div style="margin: 20px 0; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #18A07B;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
          <p>This email was sent from the Salsa Rayo contact form</p>
        </div>
      </div>
    `;

    // Format the user confirmation email
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #18A07B; font-size: 32px; margin: 0;">Salsa Rayo</h1>
          <p style="color: #7737b8; font-size: 14px; margin: 5px 0;">Dance School</p>
        </div>
        
        <h2 style="color: #333; border-bottom: 2px solid #18A07B; padding-bottom: 10px;">Thank You for Contacting Us!</h2>
        
        <div style="margin: 30px 0; background-color: #f5f5f5; padding: 25px; border-radius: 8px;">
          <p style="color: #555; line-height: 1.8; font-size: 16px; margin: 0;">
            Dear <strong>${formData.firstname}</strong>,
          </p>
          <p style="color: #555; line-height: 1.8; font-size: 16px; margin: 15px 0;">
            We have received your message and appreciate your interest in Salsa Rayo Dance School. 
            Our team will review your inquiry and get back to you as soon as possible.
          </p>
          <p style="color: #555; line-height: 1.8; font-size: 16px; margin: 15px 0;">
            In the meantime, feel free to follow us on social media to stay updated with our latest news, 
            classes, and events!
          </p>
        </div>
        
        <div style="margin: 30px 0; background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0; font-size: 18px;">Your Submitted Information:</h3>
          <ul style="color: #666; line-height: 1.8; list-style: none; padding: 0;">
            <li><strong>Name:</strong> ${formData.firstname} ${formData.lastname}</li>
            <li><strong>Email:</strong> ${formData.email}</li>
            <li><strong>Phone:</strong> ${formData.phone}</li>
            ${formData.message ? `<li style="margin-top: 10px;"><strong>Message:</strong><br/>${formData.message}</li>` : ''}
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #18A07B; font-size: 18px; font-weight: bold; margin: 10px 0;">
            Keep dancing, keep dreaming!
          </p>
          <p style="color: #666; font-size: 14px;">
            Salsa Rayo Dance School<br/>
            📍 Agios Dimitrios, Athens<br/>
            📧 ${MAIL}
          </p>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Salsa Rayo Dance School. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email to admin with all form data
    const adminResult = await sendEmail({
      to: MAIL,
      subject: `New Contact Form Submission - ${formData.firstname} ${formData.lastname}`,
      body: `New contact form submission from ${formData.firstname} ${formData.lastname}\n\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message || 'No message provided'}`,
      html: adminEmailHtml,
    });

    if (!adminResult.success) {
      throw new Error("Failed to send admin notification");
    }

    // Send confirmation email to user
    const userResult = await sendEmail({
      to: formData.email,
      subject: "Thank you for contacting Salsa Rayo Dance School",
      body: `Dear ${formData.firstname},\n\nThank you for contacting us. We have received your information and will contact you soon.\n\nBest regards,\nSalsa Rayo Dance School`,
      html: userEmailHtml,
    });

    if (!userResult.success) {
      console.error("Failed to send user confirmation email, but admin was notified");
    }

    return {
      success: true,
      message: "Your message has been sent successfully! Check your email for confirmation.",
    };
  } catch (error) {
    console.error("Error in sendContactFormEmail:", error);
    return {
      success: false,
      message: "Failed to send your message. Please try again later.",
    };
  }
};