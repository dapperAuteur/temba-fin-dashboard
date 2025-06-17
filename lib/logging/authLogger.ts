// lib/logging/authLogger.ts
import { NextRequest } from "next/server";
import { Logger, LogContext, LogLevel } from "./logger";
import { AnalyticsLogger } from "./logger";
import clientPromise from "@/lib/db/mongodb";
import { AuthEventType, AuthLog } from "@/models/AuthLog";
import { getClientIp } from "@/lib/utils";

/**
 * Log an authentication event to the database
 */
export async function logAuthEvent({
  request,
  event,
  userId = undefined,
  email = undefined,
  status,
  reason = undefined,
  metadata = {},
}: {
  request: NextRequest;
  event: AuthEventType;
  userId?: string;
  email?: string;
  status: "success" | "failure";
  reason?: string;
  metadata?: Record<string, any>;
}): Promise<string> {
  try {
    const message = `Auth event: ${event}, status: ${status}${reason ? `, reason: ${reason}` : ''}`;
    const level = status === "success" ? LogLevel.INFO : LogLevel.WARNING;

    const requestId = await Logger.log({
      context: LogContext.AUTH,
      level,
      message,
      userId,
      request,
      metadata: { ...metadata, email, reason }
    });

    // Also track as analytics event if successful
    if (status === "success") {
      let eventType = "";
      switch (event) {
        case AuthEventType.LOGIN:
          eventType = AnalyticsLogger.EventType.USER_LOGIN;
          break;
        case AuthEventType.REGISTER:
          eventType = AnalyticsLogger.EventType.USER_SIGNUP;
          break;
      }

      if (eventType) {
        await AnalyticsLogger.trackEvent({
          userId,
          eventType,
          properties: { email },
          request
        });
      }
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Get client information
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";
    
    // Create the log entry
    const logEntry: AuthLog = {
      event,
      userId,
      email,
      ipAddress,
      userAgent,
      status,
      reason,
      metadata,
      timestamp: new Date(),
    };
    
    // Insert into database
    const result = await db.collection("auth_logs").insertOne(logEntry);
    
    return result.insertedId.toString();
  } catch (error) {
    // Fail gracefully - logging should not break the application
    console.error("Failed to log auth event:", error);
    return "logging-failed";
  }
}

/**
 * Check for suspicious activity patterns in recent logs
 */
export async function checkSuspiciousActivity(
  email: string,
  ipAddress: string
): Promise<{ suspicious: boolean; reason?: string }> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Look back 24 hours
    const lookbackTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Check for multiple failed login attempts
    const failedLogins = await db.collection("auth_logs").countDocuments({
      event: AuthEventType.LOGIN_FAILURE,
      email,
      timestamp: { $gte: lookbackTime },
    });
    
    if (failedLogins >= 5) {
      return {
        suspicious: true,
        reason: `Multiple failed login attempts (${failedLogins}) in the last 24 hours`,
      };
    }
    
    // Check for logins from different locations
    const distinctIps = await db
      .collection("auth_logs")
      .distinct("ipAddress", {
        event: AuthEventType.LOGIN,
        email,
        status: "success",
        timestamp: { $gte: lookbackTime },
      });
    
    // If this IP is different and we have successful logins from other IPs
    if (distinctIps.length > 0 && !distinctIps.includes(ipAddress)) {
      return {
        suspicious: true,
        reason: "Login attempt from a new location",
      };
    }
    
    // Check for account creation and login across multiple accounts from same IP
    if (ipAddress) {
      const accountsFromIp = await db
        .collection("auth_logs")
        .distinct("email", {
          ipAddress,
          event: AuthEventType.REGISTER,
          timestamp: { $gte: lookbackTime },
        });
      
      if (accountsFromIp.length >= 3) {
        return {
          suspicious: true,
          reason: `Multiple accounts (${accountsFromIp.length}) created from the same IP address`,
        };
      }
    }
    
    return { suspicious: false };
  } catch (error) {
    console.error("Failed to check for suspicious activity:", error);
    return { suspicious: false };
  }
}

/**
 * Get authentication logs for a specific user
 */
export async function getUserAuthLogs(userId: string, limit: number = 20): Promise<AuthLog[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const logs = await db
      .collection("auth_logs")
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    return logs as AuthLog[];
  } catch (error) {
    console.error("Failed to get user auth logs:", error);
    return [];
  }
}

/**
 * Get recent failed login attempts
 */
export async function getRecentFailedLogins(limit: number = 20): Promise<AuthLog[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const logs = await db
      .collection("auth_logs")
      .find({ event: AuthEventType.LOGIN_FAILURE })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    return logs as AuthLog[];
  } catch (error) {
    console.error("Failed to get recent failed logins:", error);
    return [];
  }
}

/**
 * Get suspicious activity logs
 */
export async function getSuspiciousActivityLogs(limit: number = 20): Promise<AuthLog[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const logs = await db
      .collection("auth_logs")
      .find({ event: AuthEventType.SUSPICIOUS_ACTIVITY })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    return logs as AuthLog[];
  } catch (error) {
    console.error("Failed to get suspicious activity logs:", error);
    return [];
  }
}