// lib/logging/client-logger.ts
'use client';

// Simple client-side logger for the study functionality
export enum LogContext {
  AUTH = "auth",
  FLASHCARD = "flashcard",
  STUDY = "study",
  SYSTEM = "system"
}

export const Logger = {
  log(context: LogContext, message: string, metadata: any = {}) {
    console.log(`[${context.toUpperCase()}] ${message}`, metadata);
    
    // Could later add sending logs to server
    // fetch('/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ context, message, metadata })
    // }).catch(err => console.error('Error sending log:', err));
  },
  
  error(context: LogContext, message: string, metadata: any = {}) {
    console.error(`[${context.toUpperCase()}] ERROR: ${message}`, metadata);
    
    // Could later add sending error logs to server
  }
};