"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function EducationPage() {
  const topics = [
    {
      title: "What is RWA Tokenization?",
      description: "Learn how real-world assets are converted into digital tokens on the blockchain.",
    },
    {
      title: "How AI Valuation Works",
      description: "Understand how our AI models analyze properties and provide accurate valuations.",
    },
    {
      title: "Investing in Tokenized Real Estate",
      description: "A guide to getting started with fractional real estate investment.",
    },
    {
      title: "Understanding Risk Scores",
      description: "Learn how to interpret AI-generated risk assessments for properties.",
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <GraduationCap size={32} className="text-neon-cyan" />
          <h1 className="text-4xl font-bold">Education Center</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">{topic.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

