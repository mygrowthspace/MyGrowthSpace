import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock de Hábito
export const mockHabit = (overrides = {}) => ({
  id: '1',
  name: 'Morning Meditation',
  category: 'Mindset' as const,
  frequency: 'daily' as const,
  daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  time: '06:00',
  description: 'Daily mindfulness practice',
  streak: 5,
  completedDates: ['2026-01-19', '2026-01-18'],
  createdAt: new Date().toISOString(),
  isOneTime: false,
  ...overrides,
});

// Mock de Perfil de Usuario
export const mockProfile = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  isPremium: false,
  identityStatement: 'I am a disciplined person',
  focusAreas: ['Health', 'Mindset'],
  narrative: '',
  ...overrides,
});

// Mock de API Gemini
export const mockGeminiResponse = {
  quote: 'Success is the product of daily habits.',
  author: 'James Clear',
  actionStep: 'Start with a 2-minute habit today.',
};

// Utilidad para esperar promesas
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
