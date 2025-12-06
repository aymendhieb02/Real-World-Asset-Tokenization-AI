"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKYC } from "@/hooks/use-kyc";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export default function KYCPage() {
  const { isVerified, kycLevel } = useKYC();

  return (
    <MainLayout showSidebar role="investor">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">KYC Verification</h1>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status</span>
              {isVerified ? (
                <Badge variant="success" className="flex items-center space-x-2">
                  <CheckCircle2 size={16} />
                  <span>Verified</span>
                </Badge>
              ) : (
                <Badge variant="warning" className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>Pending</span>
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span>KYC Level</span>
              <span className="font-semibold">Level {kycLevel}</span>
            </div>

            {!isVerified && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="Enter your email" />
                </div>
                <Button className="w-full" variant="neon">
                  Submit KYC Application
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

