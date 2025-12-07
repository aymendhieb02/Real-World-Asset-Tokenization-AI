"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  getEducationLevels, 
  generateCourse, 
  searchYouTubeVideos,
  type Course,
  type EducationLevel,
  type YouTubeVideo
} from "@/lib/api/education";
import { 
  GraduationCap, 
  BookOpen, 
  PlayCircle, 
  Search, 
  Loader2, 
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Users
} from "lucide-react";
import Link from "next/link";

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(2);
  const [generatedCourse, setGeneratedCourse] = useState<Course | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [isSearchingVideos, setIsSearchingVideos] = useState(false);

  // Load education levels
  const { data: levelsData } = useQuery({
    queryKey: ["education-levels"],
    queryFn: getEducationLevels,
  });

  const levels = levelsData?.levels || {};

  // Search YouTube videos
  const handleSearchVideos = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingVideos(true);
    try {
      const result = await searchYouTubeVideos(searchQuery, 6);
      setYoutubeVideos(result.videos);
    } catch (error) {
      console.error("Error searching videos:", error);
    } finally {
      setIsSearchingVideos(false);
    }
  };

  // Generate course
  const handleGenerateCourse = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const level = selectedLevel === "all" ? "intermediate" : selectedLevel;
      const result = await generateCourse(topic, level, duration);
      const course = result.course;
      setGeneratedCourse(course);
      // Save course to localStorage
      localStorage.setItem(`course_${course.id}`, JSON.stringify(course));
    } catch (error) {
      console.error("Error generating course:", error);
      alert("Failed to generate course. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const levelColors: Record<string, string> = {
    beginner: "bg-green-500/20 text-green-400 border-green-500/50",
    intermediate: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    advanced: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    expert: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20">
              <GraduationCap size={32} className="text-neon-cyan" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                Learning Center
              </h1>
              <p className="text-foreground/60 mt-1">
                Master Real Estate Tokenization with AI-Powered Courses
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-neon-cyan/30 bg-gradient-to-br from-midnight-navy to-deep-indigo">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <BookOpen className="text-neon-cyan" size={24} />
                <div>
                  <h3 className="font-semibold">Create Course</h3>
                  <p className="text-sm text-foreground/60">Generate custom courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-neon-purple/30 bg-gradient-to-br from-midnight-navy to-deep-indigo">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <PlayCircle className="text-neon-purple" size={24} />
                <div>
                  <h3 className="font-semibold">Video Library</h3>
                  <p className="text-sm text-foreground/60">Learn from YouTube</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/30 bg-gradient-to-br from-midnight-navy to-deep-indigo">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Award className="text-green-400" size={24} />
                <div>
                  <h3 className="font-semibold">Certifications</h3>
                  <p className="text-sm text-foreground/60">Earn badges & certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Generator */}
        <Card className="mb-8 border-neon-cyan/30 bg-gradient-to-br from-midnight-navy/50 to-deep-indigo/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="text-neon-cyan" size={20} />
              <CardTitle>Generate Custom Course</CardTitle>
            </div>
            <CardDescription>
              Create a personalized course on any real estate tokenization topic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Course Topic</label>
                <Input
                  placeholder="e.g., Smart Contracts for Real Estate"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {Object.entries(levels).map(([key, level]) => (
                      <SelectItem key={key} value={key}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Duration (hours)</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 2)}
                  className="bg-background/50"
                />
              </div>
            </div>
            <Button
              onClick={handleGenerateCourse}
              disabled={!topic.trim() || isGenerating}
              className="w-full md:w-auto bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Course...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Course
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Course */}
        {generatedCourse && (
          <Card className="mb-8 border-neon-cyan/50 bg-gradient-to-br from-midnight-navy to-deep-indigo">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CardTitle className="text-2xl">{generatedCourse.title}</CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${levelColors[generatedCourse.level] || levelColors.intermediate}`}>
                      {generatedCourse.level_info.name}
                    </span>
                  </div>
                  <CardDescription className="text-base mt-2">
                    {generatedCourse.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="text-neon-cyan" size={16} />
                  <span>{generatedCourse.duration_hours} hours</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <BookOpen className="text-neon-purple" size={16} />
                  <span>{generatedCourse.modules.length} modules</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="text-green-400" size={16} />
                  <span>{generatedCourse.target_audience}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Learning Objectives</h4>
                <ul className="space-y-2">
                  {generatedCourse.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm">
                      <TrendingUp className="text-neon-cyan mt-0.5" size={16} />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Course Modules</h4>
                <div className="space-y-3">
                  {generatedCourse.modules.map((module, idx) => (
                    <Card key={idx} className="bg-background/30 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-medium">Module {idx + 1}: {module.title}</h5>
                            <p className="text-sm text-foreground/60 mt-1">{module.description}</p>
                          </div>
                          <span className="text-xs text-foreground/50">{module.duration_minutes} min</span>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs font-medium mb-1">Topics:</p>
                          <div className="flex flex-wrap gap-2">
                            {module.topics.map((topic, tIdx) => (
                              <span key={tIdx} className="px-2 py-1 bg-neon-cyan/10 text-neon-cyan text-xs rounded">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Link href={`/learn/course/${generatedCourse.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple">
                    Start Learning
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setGeneratedCourse(null)}
                >
                  Generate Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* YouTube Video Search */}
        <Card className="mb-8 border-neon-purple/30 bg-gradient-to-br from-midnight-navy/50 to-deep-indigo/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PlayCircle className="text-neon-purple" size={20} />
              <CardTitle>Search Educational Videos</CardTitle>
            </div>
            <CardDescription>
              Find YouTube videos about real estate tokenization and blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <Input
                placeholder="Search for videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchVideos()}
                className="bg-background/50"
              />
              <Button
                onClick={handleSearchVideos}
                disabled={isSearchingVideos || !searchQuery.trim()}
              >
                {isSearchingVideos ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {youtubeVideos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {youtubeVideos.map((video) => (
                  <Card key={video.id} className="bg-background/30 border-white/10 hover:border-neon-purple/50 transition-colors">
                    <CardContent className="p-0">
                      <div className="relative aspect-video">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                          <PlayCircle className="text-white" size={48} />
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-sm line-clamp-2 mb-2">{video.title}</h4>
                        <p className="text-xs text-foreground/60 mb-2">{video.channel}</p>
                        <Link href={`/learn/video/${video.id}`} className="w-full">
                          <Button variant="outline" size="sm" className="w-full">
                            Watch & Learn
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

