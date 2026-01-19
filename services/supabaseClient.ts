import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verificar si Supabase está configurado
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase no está configurado. Usando localStorage en modo local-first.'
  );
}

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Tipos para Supabase
export interface SupabaseHabit {
  id: string;
  user_id: string;
  name: string;
  category: string;
  frequency: string;
  daysOfWeek: number[];
  time?: string;
  description?: string;
  streak: number;
  completedDates: string[];
  createdAt: string;
  isOneTime?: boolean;
  specificDates?: string[];
  updated_at: string;
}

export interface SupabaseUserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  identityStatement: string;
  focusAreas: string[];
  narrative: string;
  isPremium: boolean;
  updated_at: string;
}

/**
 * Sincronizar hábitos a Supabase
 * @param userId - ID del usuario autenticado
 * @param habits - Array de hábitos a sincronizar
 * @returns true si la sincronización fue exitosa
 */
export const syncHabitsToSupabase = async (userId: string, habits: any[]) => {
  if (!supabase) {
    console.log('📱 Supabase no configurado - datos guardados localmente');
    return false;
  }

  try {
    const habitsWithUser = habits.map(h => ({
      ...h,
      user_id: userId,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('habits')
      .upsert(habitsWithUser, { onConflict: 'id' });

    if (error) {
      console.error('❌ Error sincronizando hábitos:', error);
      return false;
    }

    console.log('✅ Hábitos sincronizados correctamente');
    return true;
  } catch (e) {
    console.error('❌ Error en syncHabitsToSupabase:', e);
    return false;
  }
};

/**
 * Obtener hábitos desde Supabase
 * @param userId - ID del usuario autenticado
 * @returns Array de hábitos o array vacío si hay error
 */
export const fetchHabitsFromSupabase = async (userId: string) => {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo hábitos:', error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error('❌ Error en fetchHabitsFromSupabase:', e);
    return [];
  }
};

/**
 * Sincronizar perfil de usuario a Supabase
 * @param userId - ID del usuario
 * @param profile - Datos del perfil
 * @returns true si la sincronización fue exitosa
 */
export const syncProfileToSupabase = async (userId: string, profile: any) => {
  if (!supabase) {
    return false;
  }

  try {
    const profileWithUser = {
      ...profile,
      user_id: userId,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_profiles')
      .upsert(profileWithUser, { onConflict: 'user_id' });

    if (error) {
      console.error('❌ Error sincronizando perfil:', error);
      return false;
    }

    console.log('✅ Perfil sincronizado correctamente');
    return true;
  } catch (e) {
    console.error('❌ Error en syncProfileToSupabase:', e);
    return false;
  }
};

/**
 * Obtener perfil de usuario desde Supabase
 * @param userId - ID del usuario
 * @returns Datos del perfil o null
 */
export const fetchProfileFromSupabase = async (userId: string) => {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error obteniendo perfil:', error);
      return null;
    }

    return data || null;
  } catch (e) {
    console.error('❌ Error en fetchProfileFromSupabase:', e);
    return null;
  }
};

/**
 * Verificar si Supabase está disponible
 * @returns true si está configurado y conectado
 */
export const isSupabaseAvailable = () => {
  return isSupabaseConfigured && supabase !== null;
};

/**
 * Registrar completición de hábito (crear entry en tabla completions)
 * @param userId - ID del usuario
 * @param habitId - ID del hábito
 * @param date - Fecha de completición (YYYY-MM-DD)
 */
export const logHabitCompletion = async (userId: string, habitId: string, date: string) => {
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('habit_completions')
      .insert({
        user_id: userId,
        habit_id: habitId,
        completed_at: date,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Error registrando completición:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('❌ Error en logHabitCompletion:', e);
    return false;
  }
};

// ============================================
// AUTENTICACIÓN
// ============================================

/**
 * Register a new user
 */
export const signUp = async (email: string, password: string, name: string) => {
  if (!supabase) {
    console.error('❌ Supabase is not configured');
    return { user: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) {
      console.error('❌ Sign up error:', error.message);
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (e: any) {
    console.error('❌ Sign up exception:', e.message);
    return { user: null, error: e.message };
  }
};

/**
 * Login with email and password
 */
export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    console.error('❌ Supabase is not configured');
    return { user: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ Sign in error:', error.message);
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (e: any) {
    console.error('❌ Sign in exception:', e.message);
    return { user: null, error: e.message };
  }
};

/**
 * Logout
 */
export const signOut = async () => {
  if (!supabase) {
    console.error('❌ Supabase is not configured');
    return { error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('❌ Sign out error:', error.message);
      return { error: error.message };
    }

    return { error: null };
  } catch (e: any) {
    console.error('❌ Sign out exception:', e.message);
    return { error: e.message };
  }
};

/**
 * Get current session
 */
export const getSession = async () => {
  if (!supabase) {
    console.error('❌ Supabase is not configured');
    return null;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (e: any) {
    console.error('❌ Get session exception:', e.message);
    return null;
  }
};

/**
 * Get current user
 */
export const getUser = async () => {
  if (!supabase) {
    console.error('❌ Supabase is not configured');
    return null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (e: any) {
    console.error('❌ Get user exception:', e.message);
    return null;
  }
};

/**
 * Create user profile after sign up
 */
export const createUserProfile = async (
  userId: string,
  email: string,
  name: string,
  identityStatement: string,
  focusAreas: string[]
) => {
  if (!supabase) {
    console.error('❌ Supabase is not configured');
    return { error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        email,
        name,
        identity_statement: identityStatement,
        focus_areas: focusAreas
      });

    if (error) {
      console.error('❌ Error creating profile:', error.message);
      return { error: error.message };
    }

    return { error: null };
  } catch (e: any) {
    console.error('❌ Create profile exception:', e.message);
    return { error: e.message };
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string) => {
  if (!supabase) {
    console.error('❌ Supabase is not configured');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('❌ Error fetching profile:', error.message);
      return null;
    }

    return data;
  } catch (e: any) {
    console.error('❌ Get profile exception:', e.message);
    return null;
  }
};

