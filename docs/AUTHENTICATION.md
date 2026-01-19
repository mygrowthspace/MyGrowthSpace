# 🔐 Guía de Autenticación - Supabase Auth

## 📋 Overview

Este documento explica cómo implementar login, registro y gestión de usuarios con Supabase Auth en My Growth Space.

---

## 🚀 Instalación de @supabase/auth-ui

Supabase proporciona componentes pre-hechos para autenticación:

```bash
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

---

## 🔑 Tipos de Autenticación

### 1. Email/Contraseña (Recomendado para MVP)
- ✅ Fácil de implementar
- ✅ Funciona offline
- ✅ Sin dependencias externas
- ❌ Requiere verificación de email

### 2. OAuth (Google, GitHub)
- ✅ Mejor UX
- ✅ Seguro (mejor que contraseñas)
- ❌ Requiere setup adicional

### 3. Magic Link (Passwordless)
- ✅ Sin contraseña
- ✅ Buena UX
- ❌ Requiere email válido

---

## 📝 Implementación: Email/Contraseña

### Paso 1: Crear Hook de Autenticación

```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener sesión actual
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading session');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      return { data: null, error: message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      return { data: null, error: message };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await supabase!.auth.signOut();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    try {
      setError(null);
      const { error } = await supabase!.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OAuth failed';
      setError(message);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    isAuthenticated: !!user,
  };
};
```

### Paso 2: Crear Componente de Login

```tsx
// components/AuthModal.tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Loader } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithOAuth, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (!error) {
          alert('¡Verifica tu email para confirmar!');
          onClose();
        }
      } else {
        const { error } = await signIn(email, password);
        if (!error) {
          onClose();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="flex items-center border rounded-lg px-3">
              <Mail size={20} className="text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 py-2 px-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <div className="flex items-center border rounded-lg px-3">
              <Lock size={20} className="text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="flex-1 py-2 px-3 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader size={18} className="animate-spin" />}
            {isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => signInWithOAuth('google')}
            className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
          >
            Continuar con Google
          </button>
          <button
            onClick={() => signInWithOAuth('github')}
            className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
          >
            Continuar con GitHub
          </button>
        </div>

        <p className="text-center mt-4 text-sm">
          {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 font-medium ml-1"
          >
            {isSignUp ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>

        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-600 hover:text-gray-900"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
```

### Paso 3: Proteger Rutas

```tsx
// components/ProtectedRoute.tsx
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Requerido</h1>
          <p className="text-gray-600 mb-4">Por favor inicia sesión</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
```

### Paso 4: Usar en App.tsx

```tsx
// App.tsx
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './components/AuthModal';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Growth Space</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user.email}</span>
            <button
              onClick={signOut}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>
        )}
      </header>

      {/* Main Content */}
      {user ? (
        <ProtectedRoute>
          {/* Tu contenido principal */}
          <main className="p-8">
            <h2>Bienvenido, {user.email}!</h2>
          </main>
        </ProtectedRoute>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Inicia sesión para comenzar</p>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default App;
```

---

## 🔄 Callback Handler para OAuth

Crear archivo para manejar redirección de OAuth:

```tsx
// pages/auth/callback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase manejará automáticamente el callback
    // Redirigir al dashboard después de autenticar
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Autenticando...</h1>
        <p className="text-gray-600">Por favor espera</p>
      </div>
    </div>
  );
};
```

---

## 🧪 Testing de Autenticación

```typescript
// test/services/auth.test.ts
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../hooks/useAuth';

describe('Authentication', () => {
  it('debería registrar un nuevo usuario', async () => {
    const { signUp } = useAuth();
    const { error } = await signUp('test@example.com', 'Password123');
    expect(error).toBeNull();
  });

  it('debería iniciar sesión con email y contraseña', async () => {
    const { signIn } = useAuth();
    const { error } = await signIn('test@example.com', 'Password123');
    expect(error).toBeNull();
  });

  it('debería mantener sesión activa', async () => {
    const { user, loading } = useAuth();
    expect(loading).toBe(false);
    expect(user).toBeDefined();
  });
});
```

---

## 🔒 Mejores Prácticas

1. **Nunca expongas `service_role_key`** en el frontend
2. **Usa `anon_key`** para autenticación pública
3. **Valida user_id** en cada operación de BD
4. **Implementa rate limiting** para login attempts
5. **Usa HTTPS** en producción
6. **Limpia sesiones** al logout
7. **Implementa MFA** para cuentas premium

---

## ✅ Checklist

- [ ] @supabase/auth-ui instalado
- [ ] Hook useAuth creado
- [ ] Componente AuthModal implementado
- [ ] Rutas protegidas configuradas
- [ ] Callback OAuth configurado
- [ ] Tests de autenticación creados
- [ ] RLS verificado en Supabase
- [ ] OAuth providers configurados (opcional)

¡Autenticación lista! 🎉
