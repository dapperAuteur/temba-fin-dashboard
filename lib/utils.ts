// lib/utils.ts
import { NextRequest } from "next/server";

/**
 * Get the client IP address from a request
 */
export function getClientIp(request: NextRequest): string {
  // Check for Cloudflare or other proxy headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Get the first IP if there are multiple
    return forwardedFor.split(",")[0].trim();
  }
  
  // Fallback to local IP from connection
  return "127.0.0.1";
}