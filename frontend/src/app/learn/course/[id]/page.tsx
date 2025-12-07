"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  MessageSquare,
  Award,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { CourseModule, Course } from "@/lib/api/education";
import { AIAssistant } from "@/components/education/ai-assistant";
import { QuizModal } from "@/components/education/quiz-modal";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [showAssistant, setShowAssistant] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Load course from localStorage or generate new one
  useEffect(() => {
    const savedCourse = localStorage.getItem(`course_${courseId}`);
    if (savedCourse) {
      const courseData = JSON.parse(savedCourse);
      setCourse(courseData);
      // Load completed modules
      const savedCompleted = localStorage.getItem(`course_${courseId}_completed`);
      if (savedCompleted) {
        setCompletedModules(new Set(JSON.parse(savedCompleted)));
      }
    }
  }, [courseId]);

  // Save completed modules to localStorage
  useEffect(() => {
    if (course && completedModules.size > 0) {
      localStorage.setItem(`course_${courseId}_completed`, JSON.stringify(Array.from(completedModules)));
    }
  }, [completedModules, course, courseId]);

  if (!course) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p>Course not found. Please generate a new course.</p>
              <Link href="/learn">
                <Button className="mt-4">Go to Learning Center</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const currentModule = course.modules[currentModuleIndex];
  const progress = (completedModules.size / course.modules.length) * 100;

  const handleModuleComplete = () => {
    setCompletedModules(new Set([...completedModules, currentModuleIndex]));
  };

  const handleNextModule = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const handlePreviousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
  };

  const handleTakeQuiz = () => {
    setShowQuiz(true);
  };

  const allModulesCompleted = completedModules.size === course.modules.length;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/learn">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Learning Center
            </Button>
          </Link>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-foreground/60">{course.description}</p>
            </div>
            <Button
              onClick={() => setShowAssistant(!showAssistant)}
              variant="outline"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              AI Assistant
            </Button>
          </div>
          
          {/* Progress */}
          <Card className="bg-background/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-foreground/60">
                  {completedModules.size} / {course.modules.length} modules
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Module List */}
          <div className="lg:col-span-1">
            <Card className="bg-background/30 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Modules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.modules.map((module, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentModuleIndex(idx)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentModuleIndex === idx
                        ? "bg-neon-cyan/20 border border-neon-cyan/50"
                        : "bg-background/50 hover:bg-background/70"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {completedModules.has(idx) ? (
                        <CheckCircle2 className="text-green-400" size={16} />
                      ) : (
                        <Circle className="text-foreground/40" size={16} />
                      )}
                      <span className="text-sm font-medium">Module {idx + 1}</span>
                    </div>
                    <p className="text-xs text-foreground/60 mt-1 line-clamp-2">
                      {module.title}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-background/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      Module {currentModuleIndex + 1}: {currentModule.title}
                    </CardTitle>
                    <p className="text-sm text-foreground/60 mt-1">
                      {currentModule.duration_minutes} minutes
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Module Description */}
                <div>
                  <h3 className="font-semibold mb-2">Overview</h3>
                  <p className="text-foreground/80">{currentModule.description}</p>
                </div>

                {/* Topics */}
                <div>
                  <h3 className="font-semibold mb-3">Topics Covered</h3>
                  <div className="space-y-2">
                    {currentModule.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <BookOpen className="text-neon-cyan mt-0.5" size={16} />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <h3 className="font-semibold mb-3">Learning Outcomes</h3>
                  <ul className="space-y-2">
                    {currentModule.outcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="text-green-400 mt-0.5" size={16} />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-white/10">
                  <Button
                    onClick={handleModuleComplete}
                    disabled={completedModules.has(currentModuleIndex)}
                    className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-purple"
                  >
                    {completedModules.has(currentModuleIndex) ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark as Complete
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleTakeQuiz}
                    variant="outline"
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Take Quiz
                  </Button>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-4 border-t border-white/10">
                  <Button
                    onClick={handlePreviousModule}
                    disabled={currentModuleIndex === 0}
                    variant="outline"
                  >
                    Previous Module
                  </Button>
                  <Button
                    onClick={handleNextModule}
                    disabled={currentModuleIndex === course.modules.length - 1}
                    variant="outline"
                  >
                    Next Module
                  </Button>
                </div>

                {/* Completion Message */}
                {allModulesCompleted && (
                  <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50">
                    <CardContent className="p-6 text-center">
                      <Award className="mx-auto mb-4 text-green-400" size={48} />
                      <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                      <p className="text-foreground/80 mb-4">
                        You've completed all modules in this course.
                      </p>
                      <Link href={`/learn/certificate/${courseId}`}>
                        <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                          Get Certificate
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Assistant */}
        {showAssistant && (
          <AIAssistant
            course={course}
            currentModule={currentModule}
            onClose={() => setShowAssistant(false)}
          />
        )}

        {/* Quiz Modal */}
        {showQuiz && (
          <QuizModal
            course={course}
            moduleIndex={currentModuleIndex}
            onClose={() => setShowQuiz(false)}
          />
        )}
      </div>
    </MainLayout>
  );
}

