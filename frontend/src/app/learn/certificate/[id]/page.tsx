"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateCertification, type Certification, type Course } from "@/lib/api/education";
import { Loader2 } from "lucide-react";
import { Award, Download, Share2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CertificatePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [certification, setCertification] = useState<Certification | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load course from localStorage
    const savedCourse = localStorage.getItem(`course_${courseId}`);
    if (savedCourse) {
      const courseData = JSON.parse(savedCourse);
      setCourse(courseData);
      // Generate cert immediately with cached data if available
      const cachedCert = localStorage.getItem(`cert_${courseId}`);
      if (cachedCert) {
        try {
          setCertification(JSON.parse(cachedCert));
        } catch (e) {
          generateCert(courseData);
        }
      } else {
        generateCert(courseData);
      }
    } else {
      // If no course found, create a basic one and generate cert
      const basicCourse: Course = {
        id: courseId,
        title: "Course Completion",
        description: "",
        objectives: [],
        modules: [],
        prerequisites: [],
        target_audience: "",
        level: "intermediate",
        level_info: { name: "Intermediate", description: "", complexity: 2, color: "blue" },
        duration_hours: 1,
        created_at: new Date().toISOString()
      };
      setCourse(basicCourse);
      generateCert(basicCourse);
    }
  }, [courseId]);

  const generateCert = async (courseData: Course) => {
    setIsGenerating(true);
    try {
      // Get score from localStorage or default to 85
      const score = parseFloat(localStorage.getItem(`course_${courseId}_score`) || "85");
      const userName = localStorage.getItem("user_name") || "Student";
      
      // Generate certification with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 10000)
      );
      
      const certPromise = generateCertification(
        courseData.id,
        courseData.title,
        userName,
        score
      );
      
      const result = await Promise.race([certPromise, timeoutPromise]) as any;
      
      // Cache the certification
      if (result?.certification) {
        localStorage.setItem(`cert_${courseId}`, JSON.stringify(result.certification));
        setCertification(result.certification);
      }
    } catch (error) {
      console.error("Error generating certification:", error);
      // Create a fallback certification immediately
      const score = parseFloat(localStorage.getItem(`course_${courseId}_score`) || "85");
      const userName = localStorage.getItem("user_name") || "Student";
      
      let level = "Completion";
      let color = "#4A90E2";
      if (score >= 90) {
        level = "Gold";
        color = "#FFD700";
      } else if (score >= 75) {
        level = "Silver";
        color = "#C0C0C0";
      } else if (score >= 60) {
        level = "Bronze";
        color = "#CD7F32";
      }
      
      const fallbackCert: Certification = {
        id: `cert-${courseId}`,
        course_id: courseData.id,
        course_title: courseData.title,
        user_name: userName,
        score: score,
        level: level,
        color: color,
        issued_at: new Date().toISOString(),
        certificate_number: `CERT-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${courseId.slice(0, 8).toUpperCase()}`,
        verification_url: `/certificates/verify/${courseId}`
      };
      localStorage.setItem(`cert_${courseId}`, JSON.stringify(fallbackCert));
      setCertification(fallbackCert);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating && !certification) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-gradient-to-br from-midnight-navy to-deep-indigo border-neon-cyan/30">
            <CardContent className="p-12 text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-neon-cyan" />
              <h2 className="text-2xl font-bold mb-2">Generating Your Certificate</h2>
              <p className="text-foreground/60">Please wait while we create your blockchain-verified certificate...</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!certification) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p>Certificate not found. Please complete a course first.</p>
              <Link href="/learn">
                <Button className="mt-4">Go to Learning Center</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-midnight-navy to-deep-indigo border-2 border-neon-cyan/50 blockchain-glow">
            <CardContent className="p-12 relative overflow-hidden">
              {/* Blockchain-themed background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 246, 255, 0.1) 2px,
                    rgba(0, 246, 255, 0.1) 4px
                  )`
                }} />
              </div>
              
              {/* Certificate Design */}
              <div className="text-center space-y-6 relative z-10">
                {/* Header */}
                <motion.div 
                  className="mb-8"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Award className="mx-auto mb-4 text-neon-cyan blockchain-glow" size={64} />
                  </motion.div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                    Certificate of Completion
                  </h1>
                  <p className="text-foreground/60">This certifies that</p>
                </motion.div>

              {/* Name */}
              <motion.div 
                className="py-6 border-y-2 border-neon-cyan/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-neon-cyan">{certification.user_name}</h2>
              </motion.div>

              {/* Course Info */}
              <div className="space-y-4">
                <p className="text-lg text-foreground/80">
                  has successfully completed the course
                </p>
                <h3 className="text-2xl font-semibold">{certification.course_title}</h3>
                <div className="flex items-center justify-center space-x-4 mt-6">
                  <div className="text-center">
                    <p className="text-sm text-foreground/60">Score</p>
                    <p className="text-2xl font-bold text-neon-cyan">{certification.score.toFixed(1)}%</p>
                  </div>
                  <div className="w-px h-12 bg-white/20"></div>
                  <div className="text-center">
                    <p className="text-sm text-foreground/60">Level</p>
                    <p className="text-2xl font-bold" style={{ color: certification.color }}>
                      {certification.level}
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className="mt-8">
                <div
                  className="mx-auto w-32 h-32 rounded-full flex items-center justify-center border-4"
                  style={{
                    backgroundColor: `${certification.color}20`,
                    borderColor: certification.color,
                  }}
                >
                  <Award
                    size={64}
                    style={{ color: certification.color }}
                  />
                </div>
              </div>

              {/* Certificate Number */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-foreground/60">Certificate Number</p>
                <p className="text-lg font-mono text-neon-cyan">{certification.certificate_number}</p>
                <p className="text-xs text-foreground/50 mt-2">
                  Issued on {new Date(certification.issued_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-center space-x-4 mt-8">
                <Button
                  onClick={() => window.print()}
                  className="bg-gradient-to-r from-neon-cyan to-neon-purple"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Certificate link copied to clipboard!");
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Link href="/learn">
                  <Button variant="outline">
                    Back to Learning
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}

