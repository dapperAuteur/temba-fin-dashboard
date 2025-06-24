// models/AuthLog.ts
import { ObjectId } from "mongodb";

export interface AuthLog {
  _id?: ObjectId;
  event: string;        // Type of event (login, logout, register, etc.)
  userId?: string;      // User ID (optional for failed logins)
  email?: string;       // Email address (to track attempts across accounts)
  ipAddress: string;    // IP address of the client
  userAgent: string;    // Browser/device info
  status: "success" | "failure"; // Outcome of the event
  reason?: string;      // Reason for failure (if applicable)
  metadata?: Record<string, any>; // Additional context
  timestamp: Date;      // When the event occurred
}

// List of authentication events we want to track
export enum AuthEventType {
  REGISTER = "register",
  REGISTER_FAILURE = "register_failure",
  EMAIL_VERIFICATION = "email_verification",
  EMAIL_VERIFICATION_FAILURE = "email_verification_failure",
  LOGIN = "login",
  LOGIN_FAILURE = "login_failure",
  LOGOUT = "logout",
  PASSWORD_RESET_REQUEST = "password_reset_request",
  PASSWORD_RESET = "password_reset",
  ACCOUNT_UPDATE = "account_update",
  MFA_ENABLE = "mfa_enable",
  MFA_DISABLE = "mfa_disable",
  MFA_CHALLENGE = "mfa_challenge",
  MFA_CHALLENGE_FAILURE = "mfa_challenge_failure",
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
}