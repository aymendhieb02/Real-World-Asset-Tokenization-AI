"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAIAssistant, type Course, type CourseModule } from "@/lib/api/education";
import { MessageSquare, Send, X, Loader2, Bot } from "lucide-react";

interface AIAssistantProps {
  course: Course;
  currentModule: CourseModule;
  onClose: () => void;
}

export function AIAssistant({ course, currentModule, onClose }: AIAssistantProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim() || isLoading) return;

    const userMessage = question;
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getAIAssistant(userMessage, course, false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-background border-neon-cyan/30">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center space-x-2">
            <Bot className="text-neon-cyan" size={20} />
            <CardTitle>AI Learning Assistant</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-foreground/60 py-8">
              <Bot className="mx-auto mb-4 text-neon-cyan/50" size={48} />
              <p>Ask me anything about the course!</p>
              <p className="text-sm mt-2">
                I can help explain concepts, but I won't give direct answers to quiz questions.
              </p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-neon-cyan/20 text-right"
                    : "bg-background/50 text-left"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-background/50 rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin text-neon-cyan" />
              </div>
            </div>
          )}
        </CardContent>
        <div className="p-4 border-t flex space-x-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a question about the course..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !question.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

