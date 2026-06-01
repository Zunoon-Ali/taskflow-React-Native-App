// =============================================================================
// FILE: src/hooks/useAi.ts
// -----------------------------------------------------------------------------
// AI features (description aur coach advice) ke queries/mutations aur connection.
// =============================================================================

import { useMutation } from '@tanstack/react-query'; // Mutation handler import
import apiClient from '../api/client'; // Axios client instance

// -----------------------------------------------------------------------------
// HOOK: useAiDescription
// -----------------------------------------------------------------------------
// Task title ko dekh kar AI suggestion description generate karne ka hook
export const useAiDescription = () => {
  return useMutation<string, Error, string>({
    mutationFn: async (title: string) => {
      try {
        // Flask backend ke route /api/ai-description pe request bheje ga
        const response = await apiClient.post<{ description: string }>('/api/ai-description', { title });
        return response.data.description;
      } catch (error) {
        // Fallback: Agar Flask server band ho toh local smart responses
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('biology')) {
          return 'Based on the title, this task involves critical deadlines. Grouping the essay submission with project and book returns is efficient. Ensure you allocate time for each. Focus on the most urgent step first.';
        }
        if (lowerTitle.includes('history')) {
          return 'History task requires reading source text. Structure your essay chronology carefully and cite your references.';
        }
        if (lowerTitle.includes('math')) {
          return 'Math notes review: practice 3 sample problems from each chapter. Clear your concepts on equations.';
        }
        return 'Focus on organizing this task into smaller steps. Allocate 30-45 minutes of focused study time and avoid multitasking.';
      }
    },
  });
};

// -----------------------------------------------------------------------------
// HOOK: useAiMotivation
// -----------------------------------------------------------------------------
// Student ki feelings ke hisaab se mood analysis aur motivational quote dene ka hook
export const useAiMotivation = () => {
  return useMutation<{ mood: string; advice: string }, Error, string>({
    mutationFn: async (feeling: string) => {
      try {
        // Flask backend ke route /api/ai-motivation pe request bheje ga
        const response = await apiClient.post<{ mood: string; advice: string }>('/api/ai-motivation', { feeling });
        return response.data;
      } catch (error) {
        // Fallback: Agar Flask server off ho toh local emotion mapping aur responses
        const lowerFeeling = feeling.toLowerCase();
        if (
          lowerFeeling.includes('exam') ||
          lowerFeeling.includes('stress') ||
          lowerFeeling.includes('tomorrow') ||
          lowerFeeling.includes('anxious')
        ) {
          return {
            mood: '😟 Stressed',
            advice: 'Take a deep breath. 💦 Let\'s start by listing just the first key topic for each exam. Break it down. Focusing one thing at a time will make it less overwhelming. You can do this! 💪',
          };
        }
        if (
          lowerFeeling.includes('happy') ||
          lowerFeeling.includes('good') ||
          lowerFeeling.includes('excited') ||
          lowerFeeling.includes('fine')
        ) {
          return {
            mood: '😊 Happy',
            advice: 'Awesome to hear! Keep this positive momentum going and crush your high priority tasks today. 🌟',
          };
        }
        if (
          lowerFeeling.includes('lazy') ||
          lowerFeeling.includes('tired') ||
          lowerFeeling.includes('sleepy') ||
          lowerFeeling.includes('procrastinate')
        ) {
          return {
            mood: '🥱 Tired',
            advice: 'Start with a tiny 5-minute task. Once you start, momentum will kick in. You don\'t have to do it all at once! ⚡',
          };
        }
        return {
          mood: '😐 Neutral',
          advice: 'Organize your tasks by priority, tackle them step by step, and remember to take short breaks! You\'ve got this! 🚀',
        };
      }
    },
  });
};
