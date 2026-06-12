import { useMutation } from '@tanstack/react-query';
import { getGeminiTaskDescription, getGeminiCoachingAdvice } from '../api/geminiClient';

// Hook for generating task description suggestions using Google Gemini API
export const useAiDescription = () => {
  return useMutation<string, Error, string>({
    mutationFn: async (title: string) => {
      return await getGeminiTaskDescription(title);
    },
  });
};

// Hook for mood analysis and coaching feedback using Google Gemini API
export const useAiMotivation = () => {
  return useMutation<{ mood: string; advice: string }, Error, string>({
    mutationFn: async (feeling: string) => {
      return await getGeminiCoachingAdvice(feeling);
    },
  });
};
