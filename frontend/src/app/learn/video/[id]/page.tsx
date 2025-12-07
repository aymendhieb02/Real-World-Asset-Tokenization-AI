"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  analyzeYouTubeVideo, 
  generateQuiz, 
  type VideoAnalysis,
  type Quiz,
  type Course
} from "@/lib/api/education";
import { 
  PlayCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  Award,
  Sparkles,
  Youtube
} from "lucide-react";
import Link from "next/link";
import { QuizModal } from "@/components/education/quiz-modal";

// YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Fetch video info - try to get from localStorage first (from search results)
    const savedVideos = localStorage.getItem("youtube_videos");
    if (savedVideos) {
      try {
        const videos = JSON.parse(savedVideos);
        const foundVideo = videos.find((v: any) => v.id === videoId);
        if (foundVideo) {
          setVideoInfo(foundVideo);
        } else {
          setVideoInfo({
            id: videoId,
            title: `Video ${videoId}`,
            description: "Real estate tokenization educational video"
          });
        }
      } catch (e) {
        console.error("Error parsing saved videos:", e);
        setVideoInfo({
          id: videoId,
          title: `Video ${videoId}`,
          description: "Real estate tokenization educational video"
        });
      }
    } else {
      setVideoInfo({
        id: videoId,
        title: `Video ${videoId}`,
        description: "Real estate tokenization educational video"
      });
    }
  }, [videoId]);

  const handleGenerateQuizFromAnalysis = useCallback(async (analysisData: VideoAnalysis) => {
    if (!analysisData || !videoInfo) return;
    setIsGeneratingQuiz(true);
    try {
      // Create a course-like structure from video analysis
      const courseContent: Course = {
        id: `video-${videoId}`,
        title: videoInfo.title || "Video Course",
        description: analysisData.analysis?.concepts?.join(", ") || "",
        objectives: analysisData.analysis?.key_points || [],
        modules: [{
          title: videoInfo.title || "Video Module",
          description: analysisData.analysis?.concepts?.join(", ") || "",
          topics: analysisData.analysis?.concepts || [],
          duration_minutes: 10,
          outcomes: analysisData.analysis?.key_points || []
        }],
        prerequisites: analysisData.analysis?.prerequisites || [],
        target_audience: "All levels",
        level: analysisData.analysis?.difficulty || "intermediate",
        level_info: {
          name: analysisData.analysis?.difficulty || "Intermediate",
          description: "",
          complexity: 2,
          color: "blue"
        },
        duration_hours: 0.5,
        created_at: new Date().toISOString()
      };

      const result = await generateQuiz(courseContent, 0, 10);
      setQuiz(result.quiz);
      setShowQuiz(true);
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  }, [videoInfo, videoId]);

  const handleVideoEndCallback = useCallback(async () => {
    if (videoFinished) return; // Prevent multiple calls
    setVideoFinished(true);
    // Auto-analyze video when it ends, then auto-generate quiz
    if (!videoInfo) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeYouTubeVideo(
        videoInfo.id,
        videoInfo.title || "",
        videoInfo.description || ""
      );
      setAnalysis(result);
      
      // Auto-generate quiz after analysis completes
      if (result && result.analysis) {
        setTimeout(() => {
          handleGenerateQuizFromAnalysis(result);
        }, 1000); // Small delay to show analysis first
      }
    } catch (error) {
      console.error("Error analyzing video:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [videoInfo, videoFinished, handleGenerateQuizFromAnalysis]);

  useEffect(() => {
    if (typeof window === "undefined" || videoFinished) return;

    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let player: any = null;
    let progressInterval: NodeJS.Timeout | null = null;

    // Initialize YouTube player
    const initPlayer = () => {
      if (window.YT && window.YT.Player && iframeRef.current) {
        try {
          player = new window.YT.Player(`youtube-player-${videoId}`, {
            events: {
              onStateChange: (event: any) => {
                // Video ended (state 0)
                if (event.data === 0 && !videoFinished) {
                  if (progressInterval) clearInterval(progressInterval);
                  handleVideoEndCallback();
                }
                // Video playing (state 1) - track progress
                if (event.data === 1 && player) {
                  if (progressInterval) clearInterval(progressInterval);
                  progressInterval = setInterval(() => {
                    try {
                      if (player && !videoFinished) {
                        const currentTime = player.getCurrentTime();
                        const duration = player.getDuration();
                        if (duration > 0) {
                          const progress = (currentTime / duration) * 100;
                          setWatchProgress(progress);
                          if (progress >= 95) {
                            // Consider video watched if 95% complete
                            if (progressInterval) clearInterval(progressInterval);
                            handleVideoEndCallback();
                          }
                        }
                      }
                    } catch (e) {
                      // Ignore errors
                    }
                  }, 2000); // Check every 2 seconds
                }
              }
            }
          });
        } catch (e) {
          console.error("Error initializing YouTube player:", e);
        }
      } else if (window.YT && !window.YT.Player) {
        // Wait for API to load
        setTimeout(initPlayer, 100);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Cleanup
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [videoId, videoFinished, handleVideoEndCallback]);

  const handleAnalyzeVideo = async () => {
    if (!videoInfo) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeYouTubeVideo(
        videoInfo.id,
        videoInfo.title || "",
        videoInfo.description || ""
      );
      setAnalysis(result);
      
      // Auto-generate quiz after analysis completes
      if (result && result.analysis) {
        setTimeout(() => {
          handleGenerateQuizFromAnalysis(result);
        }, 1000); // Small delay to show analysis first
      }
    } catch (error) {
      console.error("Error analyzing video:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };


  const handleGenerateQuiz = async () => {
    if (!analysis) return;
    setIsGeneratingQuiz(true);
    try {
      // Create a course-like structure from video analysis
      const courseContent: Course = {
        id: `video-${videoId}`,
        title: videoInfo?.title || "Video Course",
        description: analysis.analysis?.concepts?.join(", ") || "",
        objectives: analysis.analysis?.key_points || [],
        modules: [{
          title: videoInfo?.title || "Video Module",
          description: analysis.analysis?.concepts?.join(", ") || "",
          topics: analysis.analysis?.concepts || [],
          duration_minutes: 10,
          outcomes: analysis.analysis?.key_points || []
        }],
        prerequisites: analysis.analysis?.prerequisites || [],
        target_audience: "All levels",
        level: analysis.analysis?.difficulty || "intermediate",
        level_info: {
          name: analysis.analysis?.difficulty || "Intermediate",
          description: "",
          complexity: 2,
          color: "blue"
        },
        duration_hours: 0.5,
        created_at: new Date().toISOString()
      };

      const result = await generateQuiz(courseContent, 0, 10);
      setQuiz(result.quiz);
      setShowQuiz(true);
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

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
          <div className="flex items-center space-x-3 mb-4">
            <Youtube className="text-red-500" size={32} />
            <h1 className="text-3xl font-bold">Video Learning</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="bg-background/30 border-neon-cyan/30">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
                  <iframe
                    ref={iframeRef}
                    id={`youtube-player-${videoId}`}
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  {watchProgress > 0 && watchProgress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                      <Progress value={watchProgress} className="h-1" />
                      <p className="text-xs text-white mt-1 text-center">
                        {Math.round(watchProgress)}% watched
                      </p>
                    </div>
                  )}
                </div>
                {videoInfo && (
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{videoInfo.title}</h2>
                    <p className="text-sm text-foreground/60">{videoInfo.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Analysis */}
            {isAnalyzing && (
              <Card className="mt-4 bg-background/30 border-neon-purple/30">
                <CardContent className="p-6 text-center">
                  <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-neon-cyan" />
                  <p>Analyzing video content with AI...</p>
                </CardContent>
              </Card>
            )}

            {analysis && !isAnalyzing && (
              <Card className="mt-4 bg-gradient-to-br from-midnight-navy to-deep-indigo border-neon-cyan/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="text-neon-cyan" size={20} />
                    <span>AI Analysis Complete</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Key Learning Points</h3>
                    <ul className="space-y-2">
                      {analysis.analysis?.key_points?.map((point, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm">
                          <CheckCircle2 className="text-green-400 mt-0.5" size={16} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Concepts Covered</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.analysis?.concepts?.map((concept, idx) => (
                        <span key={idx} className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan text-xs rounded-full">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isGeneratingQuiz && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-center space-x-2 text-neon-cyan">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating quiz based on video content...</span>
                      </div>
                    </div>
                  )}

                  {!isGeneratingQuiz && quiz && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle2 className="text-green-400" size={20} />
                          <span className="font-semibold">Quiz Ready!</span>
                        </div>
                        <p className="text-sm text-foreground/80 mb-3">
                          A personalized quiz has been generated based on the video content.
                        </p>
                        <Button
                          onClick={() => setShowQuiz(true)}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
                        >
                          <Award className="mr-2 h-4 w-4" />
                          Take Quiz Now
                        </Button>
                      </div>
                    </div>
                  )}

                  {!isGeneratingQuiz && !quiz && (
                    <div className="flex space-x-3 pt-4 border-t border-white/10">
                      <Button
                        onClick={handleGenerateQuiz}
                        className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-purple"
                      >
                        <Award className="mr-2 h-4 w-4" />
                        Generate Quiz
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {videoFinished && !analysis && !isAnalyzing && (
              <Card className="mt-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50">
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="mx-auto mb-4 text-green-400" size={48} />
                  <h3 className="text-xl font-bold mb-2">Video Completed!</h3>
                  <p className="text-foreground/80 mb-4">
                    Great job! Let's analyze the video and generate a quiz for you.
                  </p>
                  <Button
                    onClick={handleAnalyzeVideo}
                    className="bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Video
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-background/30">
              <CardHeader>
                <CardTitle className="text-lg">Video Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-foreground/60">Difficulty</div>
                  <div className="font-semibold">
                    {analysis?.analysis?.difficulty || "Not analyzed"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-foreground/60">Prerequisites</div>
                  <div className="text-sm">
                    {analysis?.analysis?.prerequisites?.join(", ") || "None"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quiz Modal */}
        {showQuiz && quiz && (
          <QuizModal
            course={{
              id: `video-${videoId}`,
              title: videoInfo?.title || "Video Course",
              description: "",
              objectives: [],
              modules: [],
              prerequisites: [],
              target_audience: "",
              level: "intermediate",
              level_info: {
                name: "Intermediate",
                description: "",
                complexity: 2,
                color: "blue"
              },
              duration_hours: 0.5,
              created_at: new Date().toISOString()
            }}
            moduleIndex={0}
            onClose={() => setShowQuiz(false)}
          />
        )}
      </div>
    </MainLayout>
  );
}

