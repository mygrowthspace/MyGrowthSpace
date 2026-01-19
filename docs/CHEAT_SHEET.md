# ⚡ My Growth Space - Cheat Sheet

Referencia rápida de comandos, rutas y configuración.

---

## 🚀 Comandos Principales

```bash
# Desarrollo
npm run dev                    # Start dev server (localhost:3000)
npm run build                  # Build for production
npm run preview                # Preview production build

# Testing
npm run test                   # Run all tests once
npm run test:ui                # Open test UI dashboard
npm run test:watch             # Watch mode
npm run test:coverage          # Generate coverage report

# Deployment
npm run deploy:cf              # Deploy to Cloudflare
npm run deploy:cf:staging      # Deploy to staging
npm run deploy:cf:prod         # Deploy to production

# Setup
bash setup.sh                  # Run setup script
```

---

## 📁 Estructura de Carpetas

```
MyGrowthSpace/
├── components/        ← React components
├── services/          ← Supabase, Gemini
├── test/              ← Tests (Vitest)
├── docs/              ← Documentation ← START HERE
├── types.ts           ← TypeScript interfaces
├── App.tsx            ← Main component
├── index.tsx          ← Entry point
├── vite.config.ts     ← Build config
├── vitest.config.ts   ← Test config
├── wrangler.toml      ← Cloudflare config
├── schema.sql         ← Database schema
├── .env.local         ← Environment variables
└── package.json       ← Dependencies
```

---

## 🗄️ Base de Datos (6 Tablas)

### Tablas Principales
| Tabla | Propósito | Foreign Keys |
|-------|-----------|--------------|
| `user_profiles` | Perfil del usuario | user_id → auth.users |
| `habits` | Definición de hábitos | user_id → auth.users |
| `habit_completions` | Registro diario | user_id, habit_id → habits |
| `ai_insights` | Análisis de Gemini | user_id, habit_id → habits |
| `suggested_cards` | Recomendaciones AI | user_id → auth.users |
| `sync_logs` | Historial de sync | user_id → auth.users |

### Campos Clave

**habits**
```
id, user_id, name, category, frequency
days_of_week[], time_of_day, streak
last_completed_date, total_completions
```

**habit_completions**
```
id, user_id, habit_id, completed_date (UNIQUE pair)
completed_at, notes
```

---

## 🔑 Variables de Entorno

```bash
# .env.local

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Gemini
VITE_GEMINI_API_KEY=your_api_key

# Environment
VITE_ENVIRONMENT=development
```

---

## 🔐 Autenticación

### Crear Usuario (Supabase UI)
1. Dashboard → Authentication → Users
2. Add user → Email & Password
3. Auto confirm ✅

### Usar en App
```typescript
import { useAuth } from './hooks/useAuth';

const { user, signIn, signUp, signOut } = useAuth();
```

---

## 📊 Queries SQL Frecuentes

### Obtener hábitos del usuario
```sql
SELECT * FROM habits 
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### Hábitos debidos hoy
```sql
SELECT * FROM habits 
WHERE user_id = auth.uid()
AND days_of_week::text[] @> ARRAY[EXTRACT(DOW FROM CURRENT_DATE)::text];
```

### Registrar completición
```sql
INSERT INTO habit_completions 
  (user_id, habit_id, completed_date) 
VALUES (auth.uid(), 'HABIT_ID', CURRENT_DATE);
```

### Obtener streaks
```sql
SELECT * FROM v_current_streaks 
WHERE user_id = auth.uid()
ORDER BY streak DESC;
```

Ver más en [SQL_QUERIES_REFERENCE.md](docs/SQL_QUERIES_REFERENCE.md)

---

## 🧪 Testing

### Crear un test
```typescript
import { describe, it, expect } from 'vitest';
import { mockHabit } from '../test/setup';

describe('Mi Feature', () => {
  it('debería hacer algo', () => {
    const habit = mockHabit({ name: 'Test' });
    expect(habit.name).toBe('Test');
  });
});
```

### Assertions comunes
```typescript
expect(value).toBe(5);                    // Igualdad estricta
expect(value).toEqual({ a: 1 });         // Comparación profunda
expect(array).toHaveLength(3);           // Largo
expect(text).toContain('word');          // Contiene
expect(() => func()).toThrow();          // Lanza error
```

---

## 🎨 React/TypeScript Patterns

### Hook personalizado
```typescript
export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  
  useEffect(() => {
    fetchHabits().then(setHabits);
  }, []);
  
  return { habits };
};
```

### Componente
```tsx
interface HabitCardProps {
  habit: Habit;
  onComplete: () => void;
}

export const HabitCard = ({ habit, onComplete }: HabitCardProps) => {
  return (
    <div className="card">
      <h3>{habit.name}</h3>
      <button onClick={onComplete}>Complete</button>
    </div>
  );
};
```

---

## 🚀 Deploy Checklist

- [ ] `npm run build` funciona
- [ ] `npm run test:coverage` → 70%+
- [ ] `npm run preview` sin errores
- [ ] `.env.local` actualizado para prod
- [ ] `wrangler.toml` configurado
- [ ] `npm run deploy:cf:prod` ejecutado
- [ ] Verificar en dominio vivo

---

## 🔗 Enlaces Rápidos

### Documentación
- 📚 [Índice Principal](docs/INDEX.md)
- ⚡ [Quick Start (15 min)](docs/SUPABASE_QUICK_START.md)
- 🗄️ [Database Architecture](docs/DATABASE_ARCHITECTURE.md)
- 🔑 [Authentication Guide](docs/AUTHENTICATION.md)
- 🧪 [Testing Guide](docs/TESTING.md)
- 💾 [SQL Reference](docs/SQL_QUERIES_REFERENCE.md)

### Configuración
- [schema.sql](schema.sql) - Base de datos
- [.env.local.example](.env.local.example) - Variables de entorno
- [package.json](package.json) - Dependencias
- [vitest.config.ts](vitest.config.ts) - Tests
- [vite.config.ts](vite.config.ts) - Build
- [wrangler.toml](wrangler.toml) - Cloudflare

### Externos
- [Supabase](https://app.supabase.com)
- [Google Gemini](https://ai.google.dev)
- [Cloudflare](https://dash.cloudflare.com)
- [GitHub](https://github.com/naiam-studio/MyGrowthSpace)

---

## 🎯 Workflow Típico

```
1. Crear rama
   git checkout -b feature/my-feature

2. Desarrollar con TDD
   npm run test:watch

3. Verificar tests
   npm run test:coverage

4. Build local
   npm run build && npm run preview

5. Commit & Push
   git add . && git commit -m "feat: ..."
   git push origin feature/my-feature

6. Deploy
   npm run deploy:cf:prod

7. Verificar en vivo
```

---

## 📞 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| `Cannot find module` | `npm install` |
| Test falla | `npm run test:watch` y debug |
| Supabase no conecta | Verifica `.env.local` |
| Build error | `npm run build --verbose` |
| Port 3000 en uso | Mata proceso o usa `npm run dev -- --port 3001` |

---

## 🎓 Próximas Cosas Para Aprender

1. **Autenticación** → [AUTHENTICATION.md](docs/AUTHENTICATION.md)
2. **Queries de BD** → [SQL_QUERIES_REFERENCE.md](docs/SQL_QUERIES_REFERENCE.md)
3. **Testing** → [TESTING.md](docs/TESTING.md)
4. **Deploy** → [DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

<div align="center">

**Bookmark esta página para referencia rápida** 📌

Última actualización: 2026-01-19

</div>
