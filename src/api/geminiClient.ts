import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

// Get API key from env variables dynamically
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);


/**
 * Generates an optimized task description based on the title.
 */
export const getGeminiTaskDescription = async (title: string): Promise<string> => {
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `As an academic assistant, write a short, highly professional, action-oriented task description (max 2-3 sentences) for a student task titled: "${title}". Do not use any introductory phrases, bullet points, or markdown styling.`;
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    const responseText = result.response.text();
    return responseText ? responseText.trim() : 'Focus on organizing this task into smaller steps and allocate dedicated study time.';
  } catch (error) {
    console.warn('Gemini API Task Description generation failed (using fallback):', error);
    return 'Focus on organizing this task into smaller steps and allocate dedicated study time.';
  }
};

/**
 * Performs emotional mood analysis and provides motivational coaching advice.
 */
export const getGeminiCoachingAdvice = async (feeling: string): Promise<{ mood: string; advice: string }> => {
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are a professional academic coach for college students. Analyze this student's feeling: "${feeling}". 
    Provide your response strictly in the following JSON format:
    {
      "mood": "Stressed" | "Happy" | "Tired" | "Neutral",
      "advice": "Short professional motivational coaching advice (max 2-3 sentences)"
    }
    Ensure the response is valid parseable JSON. Do not include markdown wraps or backticks in the response.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const responseText = result.response.text();
    if (responseText) {
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.mood && parsed.advice) {
        return {
          mood: parsed.mood.trim(),
          advice: parsed.advice.trim()
        };
      }
    }
    
    return getFallbackCoaching(feeling);
  } catch (error) {
    console.warn('Gemini API Coaching Advice generation failed (using fallback):', error);
    return getFallbackCoaching(feeling);
  }
};

const getFallbackCoaching = (feeling: string): { mood: string; advice: string } => {
  const lowerFeeling = feeling.toLowerCase();
  if (lowerFeeling.includes('exam') || lowerFeeling.includes('stress') || lowerFeeling.includes('anxious')) {
    return {
      mood: 'Stressed',
      advice: 'Take a deep breath. Start by listing the first key topic and tackle it step-by-step. Focus on one item at a time to reduce stress.'
    };
  }
  if (lowerFeeling.includes('happy') || lowerFeeling.includes('good') || lowerFeeling.includes('excited')) {
    return {
      mood: 'Happy',
      advice: 'Keep this positive momentum going and focus on finishing your high priority tasks today.'
    };
  }
  if (lowerFeeling.includes('lazy') || lowerFeeling.includes('tired') || lowerFeeling.includes('sleepy')) {
    return {
      mood: 'Tired',
      advice: 'Start with a simple 5-minute task. Once you begin, action builds momentum. Take short breaks as needed.'
    };
  }
  return {
    mood: 'Neutral',
    advice: 'Organize your tasks by priority, tackle them step by step, and remember to take short breaks.'
  };
};
