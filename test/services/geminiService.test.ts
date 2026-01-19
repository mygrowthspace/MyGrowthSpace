import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockHabit, mockProfile, mockGeminiResponse } from '../setup';

describe('Gemini Service - Análisis de Hábitos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDailyInspiration', () => {
    it('debería retornar una inspiración diaria con estructura válida', () => {
      const result = mockGeminiResponse;
      expect(result).toHaveProperty('quote');
      expect(result).toHaveProperty('author');
      expect(result).toHaveProperty('actionStep');
      expect(typeof result.quote).toBe('string');
      expect(result.quote.length).toBeGreaterThan(0);
    });

    it('debería contener un quote no vacío', () => {
      const result = mockGeminiResponse;
      expect(result.quote).toBeTruthy();
      expect(result.quote.split(' ').length).toBeGreaterThan(3);
    });

    it('debería contener un autor identificable', () => {
      const result = mockGeminiResponse;
      expect(result.author).toBeTruthy();
      expect(result.author.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeHabitProgress', () => {
    it('debería procesar un array de hábitos sin errores', () => {
      const habits = [mockHabit(), mockHabit({ name: 'Evening Walk' })];
      expect(habits).toHaveLength(2);
      expect(habits[0].name).toBe('Morning Meditation');
      expect(habits[1].name).toBe('Evening Walk');
    });

    it('debería calcular streaks correctamente', () => {
      const habit = mockHabit({ streak: 10, completedDates: ['2026-01-19', '2026-01-18', '2026-01-17'] });
      expect(habit.streak).toBe(10);
      expect(habit.completedDates).toHaveLength(3);
    });

    it('debería identificar hábitos en riesgo (streak < 3)', () => {
      const lowStreakHabit = mockHabit({ streak: 1 });
      expect(lowStreakHabit.streak).toBeLessThan(3);
    });
  });

  describe('parseRoutineToHabits', () => {
    it('debería extraer hábitos de una rutina descrita', () => {
      const routine = 'Every morning I wake up at 6am, meditate for 10 minutes, and drink water';
      const extractedHabits = [
        mockHabit({ name: 'Wake up at 6am', time: '06:00' }),
        mockHabit({ name: 'Meditate', time: '06:10' }),
        mockHabit({ name: 'Drink water', time: '06:20' }),
      ];
      expect(extractedHabits).toHaveLength(3);
      expect(extractedHabits.every(h => h.time)).toBe(true);
    });
  });
});
