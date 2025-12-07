"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateQuiz, type Course, type Quiz, type QuizQuestion } from "@/lib/api/education";
import { X, Loader2, CheckCircle2, XCircle, Award } from "lucide-react";

interface QuizModalProps {
  course: Course;
  moduleIndex: number;
  onClose: () => void;
}

export function QuizModal({ course, moduleIndex, onClose }: QuizModalProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const result = await generateQuiz(course, moduleIndex, 10);
      setQuiz(result.quiz);
    } catch (error) {
      console.error("Error loading quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!quiz) return;

    let totalScore = 0;
    let earnedPoints = 0;

    quiz.questions.forEach((q) => {
      totalScore += q.points;
      if (answers[q.id] === q.correct_answer) {
        earnedPoints += q.points;
      }
    });

    const percentage = (earnedPoints / totalScore) * 100;
    setScore(percentage);
    setShowResults(true);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
          <CardContent className="p-8 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-neon-cyan" />
            <p>Generating quiz questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-3xl bg-background">
          <CardContent className="p-8 text-center">
            <p>Failed to load quiz. Please try again.</p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-background border-neon-cyan/30">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Quiz: {quiz.module_title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {!showResults ? (
            <>
              {quiz.questions.map((question, idx) => (
                <div key={question.id} className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="font-semibold text-neon-cyan">{idx + 1}.</span>
                    <div className="flex-1">
                      <p className="font-medium mb-3">{question.question}</p>
                      <div className="space-y-2">
                        {Object.entries(question.options).map(([key, value]) => (
                          <label
                            key={key}
                            className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer border transition-colors ${
                              answers[question.id] === key
                                ? "bg-neon-cyan/20 border-neon-cyan/50"
                                : "bg-background/50 border-white/10 hover:border-neon-cyan/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={key}
                              checked={answers[question.id] === key}
                              onChange={(e) =>
                                setAnswers({ ...answers, [question.id]: e.target.value })
                              }
                              className="sr-only"
                            />
                            <span className="font-medium w-6">{key}.</span>
                            <span>{value}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-8">
                <Award
                  className={`mx-auto mb-4 ${
                    score >= 90
                      ? "text-yellow-400"
                      : score >= 75
                      ? "text-gray-300"
                      : score >= 60
                      ? "text-orange-400"
                      : "text-red-400"
                  }`}
                  size={64}
                />
                <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-3xl font-bold text-neon-cyan mb-4">
                  {score.toFixed(1)}%
                </p>
                <p className="text-foreground/60">
                  {score >= 90
                    ? "Excellent work! You've mastered this module."
                    : score >= 75
                    ? "Great job! You have a solid understanding."
                    : score >= 60
                    ? "Good effort! Review the material and try again."
                    : "Keep studying! Review the course material."}
                </p>
              </div>

              {quiz.questions.map((question, idx) => {
                const isCorrect = answers[question.id] === question.correct_answer;
                return (
                  <div key={question.id} className="space-y-2">
                    <div className="flex items-start space-x-2">
                      {isCorrect ? (
                        <CheckCircle2 className="text-green-400 mt-1" size={20} />
                      ) : (
                        <XCircle className="text-red-400 mt-1" size={20} />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm text-foreground/60 mt-2">
                          <span className="font-medium">Your answer:</span>{" "}
                          {answers[question.id] || "Not answered"}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-400 mt-1">
                            <span className="font-medium">Correct answer:</span>{" "}
                            {question.correct_answer}
                          </p>
                        )}
                        <p className="text-sm text-foreground/60 mt-2">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        {!showResults && (
          <div className="p-6 border-t flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < quiz.questions.length}
              className="bg-gradient-to-r from-neon-cyan to-neon-purple"
            >
              Submit Quiz
            </Button>
          </div>
        )}
        {showResults && (
          <div className="p-6 border-t flex justify-end">
            <Button onClick={onClose} className="bg-gradient-to-r from-neon-cyan to-neon-purple">
              Close
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

