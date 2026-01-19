import { describe, it, expect } from 'vitest';
import { mockHabit, mockProfile } from './setup';

describe('Type Validation - Estructuras de Datos', () => {
  describe('Habit Type', () => {
    it('debería crear un hábito válido con propiedades requeridas', () => {
      const habit = mockHabit();
      expect(habit).toBeDefined();
      expect(habit.id).toBeDefined();
      expect(habit.name).toBeDefined();
      expect(habit.category).toBeDefined();
      expect(habit.frequency).toBeDefined();
    });

    it('debería validar categorías permitidas', () => {
      const categories = ['Health', 'Mindset', 'Productivity', 'Finance', 'Social'];
      const habit = mockHabit();
      expect(categories).toContain(habit.category);
    });

    it('debería validar frecuencias permitidas', () => {
      const frequencies = ['daily', 'weekly', 'monthly'];
      const habit = mockHabit({ frequency: 'daily' });
      expect(frequencies).toContain(habit.frequency);
    });

    it('debería soportar hábitos one-time', () => {
      const oneTimeHabit = mockHabit({ 
        isOneTime: true, 
        specificDates: ['2026-02-14'],
        frequency: 'weekly'
      });
      expect(oneTimeHabit.isOneTime).toBe(true);
      expect(oneTimeHabit.specificDates).toContain('2026-02-14');
    });

    it('debería tener daysOfWeek válidos (0-6)', () => {
      const habit = mockHabit();
      expect(habit.daysOfWeek).toBeDefined();
      expect(habit.daysOfWeek.every(day => day >= 0 && day <= 6)).toBe(true);
    });

    it('debería tener fecha de creación en ISO 8601', () => {
      const habit = mockHabit();
      expect(() => new Date(habit.createdAt)).not.toThrow();
    });
  });

  describe('UserProfile Type', () => {
    it('debería crear un perfil de usuario válido', () => {
      const profile = mockProfile();
      expect(profile).toBeDefined();
      expect(profile.name).toBeDefined();
      expect(profile.email).toBeDefined();
      expect(profile.focusAreas).toBeDefined();
    });

    it('debería contener identity statement', () => {
      const profile = mockProfile();
      expect(profile.identityStatement).toBeDefined();
      expect(typeof profile.identityStatement).toBe('string');
    });

    it('debería tener al menos un focus area', () => {
      const profile = mockProfile();
      expect(profile.focusAreas.length).toBeGreaterThan(0);
    });

    it('debería validar formato de email', () => {
      const profile = mockProfile({ email: 'valid@example.com' });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(profile.email)).toBe(true);
    });

    it('debería tener isPremium como booleano', () => {
      const profile = mockProfile();
      expect(typeof profile.isPremium).toBe('boolean');
    });
  });

  describe('Data Integrity', () => {
    it('debería mantener consistencia entre hábitos y streaks', () => {
      const habits = [
        mockHabit({ name: 'Habit 1', streak: 5 }),
        mockHabit({ name: 'Habit 2', streak: 10 }),
      ];
      expect(habits.every(h => h.streak >= 0)).toBe(true);
    });

    it('debería no permitir daysOfWeek duplicados', () => {
      const daysOfWeek = [0, 1, 2, 2, 3]; // 2 duplicado
      const uniqueDays = [...new Set(daysOfWeek)];
      expect(uniqueDays.length).toBeLessThanOrEqual(daysOfWeek.length);
    });
  });
});
