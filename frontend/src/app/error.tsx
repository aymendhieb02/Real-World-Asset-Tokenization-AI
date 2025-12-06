"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 246, 255, 0.5)",
              "0 0 40px rgba(0, 246, 255, 0.8)",
              "0 0 20px rgba(0, 246, 255, 0.5)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="inline-block p-8 rounded-full bg-neon-cyan/20 mb-6"
        >
          <AlertCircle size={64} className="text-neon-cyan" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-foreground/70 mb-8 max-w-md mx-auto">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button onClick={reset} variant="neon" size="lg">
          Try Again
        </Button>
      </motion.div>
    </div>
  );
}

