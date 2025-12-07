/**
 * Education API Client
 * Handles all education-related API calls
 */

const ML_API_BASE_URL = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:5001";

export interface EducationLevel {
  name: string;
  description: string;
  complexity: number;
  color: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channel: string;
  published_at: string;
}

export interface VideoAnalysis {
  video_id: string;
  analysis: {
    key_points: string[];
    concepts: string[];
    difficulty: string;
    prerequisites: string[];
    applications: string[];
  };
}

export interface CourseModule {
  title: string;
  description: string;
  topics: string[];
  duration_minutes: number;
  outcomes: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  modules: CourseModule[];
  prerequisites: string[];
  target_audience: string;
  level: string;
  level_info: EducationLevel;
  duration_hours: number;
  created_at: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: "A" | "B" | "C" | "D";
  explanation: string;
  points: number;
}

export interface Quiz {
  quiz_id: string;
  module_title: string;
  questions: QuizQuestion[];
  total_points: number;
  course_id?: string;
  module_index?: number;
  created_at?: string;
}

export interface Certification {
  id: string;
  course_id: string;
  course_title: string;
  user_name: string;
  score: number;
  level: string;
  color: string;
  issued_at: string;
  certificate_number: string;
  verification_url: string;
}

export interface AssistantResponse {
  response: string;
  can_help: boolean;
  timestamp?: string;
  error?: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  published_at: string;
  source: string;
}

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${ML_API_BASE_URL}${endpoint}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds for AI generation
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout - The education service may be processing. Please try again.`);
    }
    throw error;
  }
}

export async function getEducationLevels(): Promise<{ success: boolean; levels: Record<string, EducationLevel> }> {
  return apiCall("/api/education/levels");
}

export async function searchYouTubeVideos(query: string, maxResults: number = 5): Promise<{ success: boolean; videos: YouTubeVideo[] }> {
  return apiCall(`/api/education/youtube/search?query=${encodeURIComponent(query)}&max_results=${maxResults}`);
}

export async function analyzeYouTubeVideo(videoId: string, videoTitle: string, videoDescription: string = ""): Promise<{ success: boolean } & VideoAnalysis> {
  return apiCall(`/api/education/youtube/analyze?video_id=${encodeURIComponent(videoId)}&video_title=${encodeURIComponent(videoTitle)}&video_description=${encodeURIComponent(videoDescription)}`, {
    method: "POST",
  });
}

export async function generateCourse(topic: string, level: string = "intermediate", durationHours: number = 2): Promise<{ success: boolean; course: Course }> {
  return apiCall("/api/education/courses/generate", {
    method: "POST",
    body: JSON.stringify({ topic, level, duration_hours: durationHours }),
  });
}

export async function generateQuiz(courseContent: Course, moduleIndex: number = 0, numQuestions: number = 10): Promise<{ success: boolean; quiz: Quiz }> {
  return apiCall("/api/education/quizzes/generate", {
    method: "POST",
    body: JSON.stringify({
      course_content: courseContent,
      module_index: moduleIndex,
      num_questions: numQuestions,
    }),
  });
}

export async function generateCertification(courseId: string, courseTitle: string, userName: string, score: number): Promise<{ success: boolean; certification: Certification }> {
  return apiCall("/api/education/certifications/generate", {
    method: "POST",
    body: JSON.stringify({
      course_id: courseId,
      course_title: courseTitle,
      user_name: userName,
      score,
    }),
  });
}

export async function getAIAssistant(question: string, courseContext?: Course, isExam: boolean = false): Promise<{ success: boolean } & AssistantResponse> {
  return apiCall("/api/education/assistant", {
    method: "POST",
    body: JSON.stringify({
      question,
      course_context: courseContext,
      is_exam: isExam,
    }),
  });
}

export async function getCryptoNews(limit: number = 5): Promise<{ success: boolean; articles: NewsArticle[] }> {
  return apiCall(`/api/education/news?limit=${limit}`);
}

