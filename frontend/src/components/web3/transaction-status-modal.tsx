"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TransactionStatusModalProps {
  open: boolean;
  onClose: () => void;
  status: "pending" | "success" | "error";
  txHash?: string;
  message?: string;
}

export function TransactionStatusModal({
  open,
  onClose,
  status,
  txHash,
  message,
}: TransactionStatusModalProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Loader2 className="h-12 w-12 text-neon-cyan animate-spin" />;
      case "success":
        return <CheckCircle2 className="h-12 w-12 text-green-500" />;
      case "error":
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Transaction Pending";
      case "success":
        return "Transaction Successful";
      case "error":
        return "Transaction Failed";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30";
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex flex-col items-center space-y-4">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
          </DialogTitle>
          {message && (
            <DialogDescription className="text-center pt-2">
              {message}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {txHash && (
            <div className="flex items-center justify-between p-3 glass rounded-lg">
              <span className="text-sm text-foreground/70">Transaction Hash:</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs font-mono">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </code>
                <a
                  href={`https://amoy.polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-cyan hover:underline"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Badge variant="outline" className={getStatusColor()}>
              {status.toUpperCase()}
            </Badge>
          </div>

          <Button
            onClick={onClose}
            className="w-full"
            variant={status === "success" ? "default" : "outline"}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

