// lib/logging/authLogger.ts
import { NextRequest } from "next/server";
// import { Logger, LogContext, LogLevel } from "./logger";
import prisma from "./../db/prisma";
import { AnalyticsLogger } from "./logger";
import { AuthEventType, AuthLog } from "@/app/(models)/AuthLog";
import { getClientIp } from "./../utils";


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
  metadata?: Record<string, unknown>;
}): Promise<string> {
  try {
    // const message = `Auth event: ${event}, status: ${status}${reason ? `, reason: ${reason}` : ''}`;
    // const level = status === "success" ? LogLevel.INFO : LogLevel.WARNING;

    // const requestId = await Logger.log({
    //   context: LogContext.AUTH,
    //   level,
    //   message,
    //   userId,
    //   request,
    //   metadata: { ...metadata, email, reason }
    // });

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
    
    // Get client information
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";
    
    // Create the log entry
    const logEntry: AuthLog = {
      event: event.toString(),
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
    const result = await await prisma.authLog.create({
      data: logEntry,
    });
    
    return result.id;
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
    const lookbackTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Check for multiple failed login attempts
    const failedLogins = await prisma.authLog.count({
      where: {
        event: AuthEventType.LOGIN_FAILURE,
        email,
        timestamp: {
          gte: lookbackTime,
        },
      
      }
    });
    
    if (failedLogins >= 5) {
      return {
        suspicious: true,
        reason: `Multiple failed login attempts (${failedLogins}) in the last 24 hours`,
      };
    }
    
    // Check for logins from different locations
    const distinctIpsRecords = await prisma.authLog.findMany({
      select: {
        ipAddress: true,
      },
      where: {
        event: AuthEventType.LOGIN,
        email,
        timestamp: {
          gte: lookbackTime,
        }, 
      }
    });

    const distinctIpStrings = distinctIpsRecords.map((record) => record.ipAddress);
    
    if (distinctIpStrings.length > 0 && !distinctIpStrings.includes(ipAddress)) {
      return {
        suspicious: true,
        reason: "Login attempt from a new location",
      };
    }
    
    // Check for account creation and login across multiple accounts from same IP
    if (distinctIpStrings) {
      const accountsFromIp = await prisma.authLog.findMany({
        where: {
          event: AuthEventType.REGISTER,
          ipAddress,
          timestamp: {
            gte: lookbackTime,
          },
        },
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
    const logs = await prisma.authLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    })
    
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
    
    const logs = await prisma.authLog.findMany({
      where: {
        event: AuthEventType.LOGIN_FAILURE,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    });
    
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
    
    const logs = await prisma.authLog.findMany({
      where: {
        event: AuthEventType.SUSPICIOUS_ACTIVITY,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    });
    
    return logs as AuthLog[];
  } catch (error) {
    console.error("Failed to get suspicious activity logs:", error);
    return [];
  }
}