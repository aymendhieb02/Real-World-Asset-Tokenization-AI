"""
Education Service - Content Generation, Quizzes, Certifications
Integrates with YouTube API, OpenRouter AI, and RapidAPI
"""
import os
import json
import logging
import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

# API Keys
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "AIzaSyA15r2-AecTEzuAeTSowEOpKMYW6aG2VA0")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "1d049b3786msh8a1d16f97d5e6c0p1a76ebjsna79acfbd9fa6")
OPENROUTER_MODEL = "kwaipilot/kat-coder-pro:free"

# Education Levels
EDUCATION_LEVELS = {
    "beginner": {
        "name": "Beginner",
        "description": "Introduction to concepts",
        "complexity": 1,
        "color": "green"
    },
    "intermediate": {
        "name": "Intermediate",
        "description": "Building on fundamentals",
        "complexity": 2,
        "color": "blue"
    },
    "advanced": {
        "name": "Advanced",
        "description": "Expert-level content",
        "complexity": 3,
        "color": "purple"
    },
    "expert": {
        "name": "Expert",
        "description": "Master-level expertise",
        "complexity": 4,
        "color": "red"
    }
}


class EducationService:
    """Service for generating educational content, quizzes, and certifications"""
    
    def __init__(self):
        self.youtube_base_url = "https://www.googleapis.com/youtube/v3"
        self.openrouter_url = "https://openrouter.ai/api/v1/chat/completions"
        self.rapidapi_base = "https://cryptocurrency-news2.p.rapidapi.com"
    
    async def search_youtube_videos(self, query: str, max_results: int = 5) -> List[Dict]:
        """Search YouTube for educational videos"""
        try:
            async with httpx.AsyncClient() as client:
                params = {
                    "part": "snippet",
                    "q": query,
                    "type": "video",
                    "maxResults": max_results,
                    "key": YOUTUBE_API_KEY,
                    "videoCategoryId": "27"  # Education category
                }
                response = await client.get(
                    f"{self.youtube_base_url}/search",
                    params=params,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                
                videos = []
                for item in data.get("items", []):
                    videos.append({
                        "id": item["id"]["videoId"],
                        "title": item["snippet"]["title"],
                        "description": item["snippet"]["description"],
                        "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                        "channel": item["snippet"]["channelTitle"],
                        "published_at": item["snippet"]["publishedAt"]
                    })
                return videos
        except Exception as e:
            logger.error(f"Error searching YouTube: {e}")
            return []
    
    async def analyze_video_with_ai(self, video_id: str, video_title: str, video_description: str) -> Dict:
        """Use OpenRouter AI to analyze YouTube video and extract key insights"""
        try:
            prompt = f"""Analyze this YouTube video about real estate tokenization and blockchain:

Title: {video_title}
Description: {video_description[:500]}

Please provide:
1. Key learning points (3-5 bullet points)
2. Main concepts covered
3. Difficulty level (beginner/intermediate/advanced/expert)
4. Prerequisites needed
5. Practical applications

Format as JSON with keys: key_points, concepts, difficulty, prerequisites, applications"""
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.openrouter_url,
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": OPENROUTER_MODEL,
                        "messages": [
                            {"role": "system", "content": "You are an expert educational content analyzer. Always respond with valid JSON."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.7
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
                # Try to parse JSON from response
                try:
                    analysis = json.loads(content)
                except:
                    # If not JSON, create structured response
                    analysis = {
                        "key_points": [content[:200]],
                        "concepts": ["Real Estate", "Tokenization"],
                        "difficulty": "intermediate",
                        "prerequisites": ["Basic blockchain knowledge"],
                        "applications": ["Investment strategies"]
                    }
                
                return {
                    "video_id": video_id,
                    "analysis": analysis
                }
        except Exception as e:
            logger.error(f"Error analyzing video with AI: {e}")
            return {
                "video_id": video_id,
                "analysis": {
                    "key_points": ["Video analysis unavailable"],
                    "concepts": [],
                    "difficulty": "intermediate",
                    "prerequisites": [],
                    "applications": []
                }
            }
    
    async def generate_course_content(self, topic: str, level: str = "intermediate", duration_hours: int = 2) -> Dict:
        """Generate comprehensive course content using AI"""
        try:
            level_info = EDUCATION_LEVELS.get(level, EDUCATION_LEVELS["intermediate"])
            
            prompt = f"""Create a comprehensive {level_info['name']}-level course on "{topic}" for real estate tokenization education.

Course Requirements:
- Duration: {duration_hours} hours
- Level: {level_info['name']} ({level_info['description']})
- Format: Structured learning modules

Please generate:
1. Course title and description
2. Learning objectives (5-7 objectives)
3. Course modules with:
   - Module title
   - Module description
   - Key topics covered
   - Estimated time
   - Learning outcomes
4. Prerequisites
5. Target audience

Format as JSON with this structure:
{{
  "title": "...",
  "description": "...",
  "objectives": ["..."],
  "modules": [
    {{
      "title": "...",
      "description": "...",
      "topics": ["..."],
      "duration_minutes": 30,
      "outcomes": ["..."]
    }}
  ],
  "prerequisites": ["..."],
  "target_audience": "..."
}}"""
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.openrouter_url,
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": OPENROUTER_MODEL,
                        "messages": [
                            {"role": "system", "content": "You are an expert course creator. Always respond with valid JSON only, no markdown formatting."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.8
                    },
                    timeout=60.0
                )
                response.raise_for_status()
                data = response.json()
                
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
                # Clean up markdown code blocks if present
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                try:
                    course = json.loads(content)
                except json.JSONDecodeError:
                    # Fallback course structure
                    course = {
                        "title": f"{topic} - {level_info['name']} Course",
                        "description": f"Learn {topic} at {level_info['name']} level",
                        "objectives": [f"Understand {topic}", f"Apply {topic} concepts", f"Master {topic} techniques"],
                        "modules": [
                            {
                                "title": f"Introduction to {topic}",
                                "description": f"Get started with {topic}",
                                "topics": [topic],
                                "duration_minutes": 30,
                                "outcomes": [f"Understand {topic} basics"]
                            }
                        ],
                        "prerequisites": ["Basic knowledge"],
                        "target_audience": "All levels"
                    }
                
                # Add metadata
                course["id"] = str(uuid.uuid4())
                course["level"] = level
                course["level_info"] = level_info
                course["duration_hours"] = duration_hours
                course["created_at"] = datetime.now().isoformat()
                
                return course
        except Exception as e:
            logger.error(f"Error generating course: {e}")
            raise
    
    async def generate_quiz(self, course_content: Dict, module_index: int = 0, num_questions: int = 10) -> Dict:
        """Generate quiz questions for a course module"""
        try:
            module = course_content.get("modules", [{}])[module_index] if course_content.get("modules") else {}
            
            prompt = f"""Create a quiz for this course module:

Course: {course_content.get('title', 'Unknown')}
Module: {module.get('title', 'Unknown')}
Topics: {', '.join(module.get('topics', []))}
Level: {course_content.get('level', 'intermediate')}

Generate {num_questions} quiz questions with:
1. Question text
2. 4 multiple choice options (A, B, C, D)
3. Correct answer (A, B, C, or D)
4. Explanation for the correct answer
5. Points (1-5 based on difficulty)

Format as JSON:
{{
  "quiz_id": "...",
  "module_title": "...",
  "questions": [
    {{
      "id": 1,
      "question": "...",
      "options": {{
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "..."
      }},
      "correct_answer": "A",
      "explanation": "...",
      "points": 1
    }}
  ],
  "total_points": 10
}}"""
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.openrouter_url,
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": OPENROUTER_MODEL,
                        "messages": [
                            {"role": "system", "content": "You are an expert quiz creator. Always respond with valid JSON only, no markdown."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.7
                    },
                    timeout=60.0
                )
                response.raise_for_status()
                data = response.json()
                
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
                # Clean markdown
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                try:
                    quiz = json.loads(content)
                except json.JSONDecodeError:
                    # Fallback quiz
                    quiz = {
                        "quiz_id": str(uuid.uuid4()),
                        "module_title": module.get("title", "Unknown"),
                        "questions": [],
                        "total_points": 0
                    }
                
                quiz["course_id"] = course_content.get("id")
                quiz["module_index"] = module_index
                quiz["created_at"] = datetime.now().isoformat()
                
                return quiz
        except Exception as e:
            logger.error(f"Error generating quiz: {e}")
            raise
    
    async def generate_certification(self, course_id: str, course_title: str, user_name: str, score: float) -> Dict:
        """Generate certification badge/certificate for course completion"""
        try:
            # Determine certification level based on score
            if score >= 90:
                cert_level = "Gold"
                cert_color = "#FFD700"
            elif score >= 75:
                cert_level = "Silver"
                cert_color = "#C0C0C0"
            elif score >= 60:
                cert_level = "Bronze"
                cert_color = "#CD7F32"
            else:
                cert_level = "Completion"
                cert_color = "#4A90E2"
            
            certification = {
                "id": str(uuid.uuid4()),
                "course_id": course_id,
                "course_title": course_title,
                "user_name": user_name,
                "score": score,
                "level": cert_level,
                "color": cert_color,
                "issued_at": datetime.now().isoformat(),
                "certificate_number": f"CERT-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}",
                "verification_url": f"/certificates/verify/{str(uuid.uuid4())}"
            }
            
            return certification
        except Exception as e:
            logger.error(f"Error generating certification: {e}")
            raise
    
    async def get_ai_assistant_help(self, question: str, course_context: Optional[Dict] = None, is_exam: bool = False) -> Dict:
        """AI assistant for course help (NOT for exams/quizzes)"""
        if is_exam:
            return {
                "response": "I cannot provide direct answers during exams or quizzes. However, I can help you understand the concepts if you ask about the course material in a learning context.",
                "can_help": False
            }
        
        try:
            context = ""
            if course_context:
                context = f"\n\nCourse Context:\nTitle: {course_context.get('title', '')}\nTopics: {', '.join(course_context.get('modules', [{}])[0].get('topics', []) if course_context.get('modules') else [])}"
            
            prompt = f"""You are a helpful educational assistant for a real estate tokenization course. Help the student understand the concept they're asking about, but don't give direct answers to quiz/exam questions.

Student Question: {question}{context}

Provide:
1. A clear explanation of the concept
2. Examples or analogies if helpful
3. Related topics they might want to explore
4. Encouragement to think through the problem

Be educational and supportive, but don't solve problems directly."""
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.openrouter_url,
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": OPENROUTER_MODEL,
                        "messages": [
                            {"role": "system", "content": "You are a helpful educational assistant. Guide students to understand concepts without giving direct answers."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.7
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "I'm here to help! What would you like to understand?")
                
                return {
                    "response": content,
                    "can_help": True,
                    "timestamp": datetime.now().isoformat()
                }
        except Exception as e:
            logger.error(f"Error getting AI assistant help: {e}")
            return {
                "response": "I'm having trouble processing your question right now. Please try again later.",
                "can_help": False,
                "error": str(e)
            }
    
    async def get_crypto_news(self, limit: int = 5) -> List[Dict]:
        """Get cryptocurrency/blockchain news for educational context"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.rapidapi_base}/v1/cryptodaily",
                    headers={
                        "x-rapidapi-key": RAPIDAPI_KEY,
                        "x-rapidapi-host": "cryptocurrency-news2.p.rapidapi.com"
                    },
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                
                articles = []
                for item in data.get("data", [])[:limit]:
                    articles.append({
                        "title": item.get("title", ""),
                        "description": item.get("description", ""),
                        "url": item.get("url", ""),
                        "published_at": item.get("publishedAt", ""),
                        "source": item.get("source", "")
                    })
                return articles
        except Exception as e:
            logger.error(f"Error fetching crypto news: {e}")
            return []


# Global instance
education_service = EducationService()

