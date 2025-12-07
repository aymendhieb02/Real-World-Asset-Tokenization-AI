"use client";

import { useEffect } from "react";

/**
 * Suppresses specific console errors that are not critical
 * - Web3Modal/Reown remote config fetch errors (403)
 * - Source map parsing errors
 */
export function SuppressErrors() {
  useEffect(() => {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;

    // Helper to check if message should be suppressed
    const shouldSuppress = (message: string): boolean => {
      const suppressPatterns = [
        "Failed to fetch remote project configuration",
        "Reown Config",
        "api.web3modal.org",
        "HTTP status code: 403",
        "not found on Allowlist",
        "update configuration on cloud.reown.com",
        "Invalid source map",
        "sourceMapURL could not be parsed",
        "@reown/appkit",
        "@reown/appkit-controllers",
        "Only conformant source maps",
        "Could not find original code",
        "sourceMapURL could not be parsed",
        "projectId=00000000000000000000000000000000"
      ];
      
      return suppressPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      );
    };

    // Override console.error to filter out unwanted errors
    console.error = (...args: unknown[]) => {
      const message = String(args.join(" "));
      
      if (shouldSuppress(message)) {
        return; // Suppress this error
      }

      // Also check error objects
      if (args[0] instanceof Error) {
        const errorMessage = args[0].message + " " + args[0].stack;
        if (shouldSuppress(errorMessage)) {
          return;
        }
      }

      // Call original error for other messages
      originalError.apply(console, args);
    };

    // Override console.warn to filter out unwanted warnings
    console.warn = (...args: unknown[]) => {
      const message = String(args.join(" "));
      
      if (shouldSuppress(message)) {
        return; // Suppress this warning
      }

      // Call original warn for other messages
      originalWarn.apply(console, args);
    };

    // Also suppress unhandled promise rejections for these errors
    const handleRejection = (event: PromiseRejectionEvent) => {
      const message = String(event.reason?.message || event.reason || "");
      if (shouldSuppress(message)) {
        event.preventDefault();
        return;
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);

    // Cleanup: restore original console methods on unmount
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}

