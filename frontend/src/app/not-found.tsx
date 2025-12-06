"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        <motion.h1
          className="text-9xl font-bold mb-4 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent"
          animate={{
            filter: [
              "blur(0px)",
              "blur(2px)",
              "blur(0px)",
            ],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          404
        </motion.h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-foreground/70 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="neon" size="lg">
            <Home size={20} className="mr-2" />
            Go Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

