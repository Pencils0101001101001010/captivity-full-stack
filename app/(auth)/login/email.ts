import nodemailer from "nodemailer";
import { z } from "zod";

// Define error types
interface SmtpError extends Error {
  code?: string;
  responseCode?: number;
  command?: string;
}

// Validate SMTP configuration
const smtpConfigSchema = z.object({
  host: z.string().min(1, "SMTP host is required"),
  port: z.number().int().positive(),
  secure: z.boolean(),
  user: z.string().min(1, "SMTP user is required"),
  password: z.string().min(1, "SMTP password is required"),
  fromEmail: z.string().email().optional(),
});

// Validate email parameters
const emailParamsSchema = z.object({
  to: z.string().email("Invalid recipient email address"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "Email content is required"),
});

interface EmailProps {
  to: string;
  subject: string;
  html: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromEmail?: string;
}

function validateSmtpConfig(): SmtpConfig {
  try {
    const config = smtpConfigSchema.parse({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      fromEmail: process.env.SMTP_FROM_EMAIL,
    });
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map(issue => `${issue.path}: ${issue.message}`)
        .join(", ");
      throw new Error(`Invalid SMTP configuration: ${issues}`);
    }
    throw error;
  }
}

// Create transporter with validation
function createTransporter() {
  const config = validateSmtpConfig();

  console.log("Initializing SMTP transport with config:", {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.user,
    // Mask credentials in logs
    hasPassword: !!config.password,
  });

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
    // Add debug option in development
    ...(process.env.NODE_ENV === "development" && { debug: true }),
  });
}

let transporter: nodemailer.Transporter | null = null;

export async function sendEmail({ to, subject, html }: EmailProps) {
  try {
    // Validate email parameters
    const validatedParams = emailParamsSchema.parse({ to, subject, html });

    const config = validateSmtpConfig();
    const fromEmail = config.fromEmail || config.user;

    console.log("Attempting to send email:", {
      to: validatedParams.to,
      from: fromEmail,
      subject: validatedParams.subject,
      timestamp: new Date().toISOString(),
    });

    transporter = createTransporter();

    // Verify SMTP connection before sending
    await transporter.verify();

    const info = await transporter.sendMail({
      from: fromEmail,
      to: validatedParams.to,
      subject: validatedParams.subject,
      html: validatedParams.html,
    });

    console.log("Email sent successfully:", {
      messageId: info.messageId,
      response: info.response,
      envelope: info.envelope,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      data: {
        messageId: info.messageId,
        envelope: info.envelope,
        response: info.response,
      },
    };
  } catch (error: unknown) {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      recipient: to,
      environment: process.env.NODE_ENV,
      errorName: error instanceof Error ? error.name : "Unknown Error",
      errorMessage:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorCode: (error as SmtpError).code,
      responseCode: (error as SmtpError).responseCode,
      command: (error as SmtpError).command,
      // Include stack trace in development only
      ...(process.env.NODE_ENV === "development" && {
        stack: error instanceof Error ? error.stack : undefined,
      }),
    };

    console.error("Failed to send email. Details:", errorDetails);

    // Throw a sanitized error for production
    if (process.env.NODE_ENV === "production") {
      throw new Error("Failed to send email. Please try again later.");
    }

    // In development, throw the original error for debugging
    throw error;
  } finally {
    // Clean up resources
    if (transporter) {
      transporter.close();
      transporter = null;
    }
  }
}

// Optional: Add a test function for verifying SMTP configuration
export async function testSmtpConnection(): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true, message: "SMTP connection successful" };
  } catch (error: unknown) {
    return {
      success: false,
      message: "SMTP connection failed",
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
