# 📚 My Growth Space - Documentación Completa

Bienvenido a la documentación de **My Growth Space**. Aquí encontrarás guías para cada aspecto del proyecto.

---

## 🚀 Comenzar Rápido

### ⚡ Cheat Sheet (30 segundos)
👉 [CHEAT_SHEET.md](./CHEAT_SHEET.md)

Referencia rápida de comandos, rutas, queries SQL y troubleshooting.

### Si tienes 15 minutos:
👉 [⚡ Supabase Quick Start](./SUPABASE_QUICK_START.md)

Guía rápida para:
- Crear proyecto Supabase
- Ejecutar SQL schema
- Configurar autenticación
- Probar conexión

### Si tienes 30 minutos:
👉 [🚀 README.md](../README.md)

Overview completo del proyecto, features y tech stack.

---

## 📖 Guías por Tópico

### 🗄️ Base de Datos

| Guía | Duración | Objetivo |
|------|----------|----------|
| [Supabase Setup](./SUPABASE_SETUP.md) | 20 min | Configuración detallada paso a paso |
| [Database Architecture](./DATABASE_ARCHITECTURE.md) | 15 min | Estructura de datos, diagrama ER |
| [SQL Queries Reference](./SQL_QUERIES_REFERENCE.md) | 10 min | Queries útiles para desarrollo |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | 5 min | Resumen de tablas y campos |

**¿Por dónde empiezo?**
1. Lee [SUPABASE_QUICK_START.md](./SUPABASE_QUICK_START.md) para setup inicial
2. Luego lee [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) para entender la estructura
3. Usa [SQL_QUERIES_REFERENCE.md](./SQL_QUERIES_REFERENCE.md) como referencia mientras desarrollas

---

### 🔐 Autenticación & Usuarios

| Guía | Duración | Objetivo |
|------|----------|----------|
| [Authentication Guide](./AUTHENTICATION.md) | 25 min | Implementar login/registro/OAuth |

**En esta guía aprenderás:**
- ✅ Crear hook `useAuth()` para manejar sesiones
- ✅ Componente `AuthModal` ready-to-use
- ✅ Proteger rutas con `ProtectedRoute`
- ✅ Soportar OAuth (Google, GitHub)
- ✅ Tests de autenticación

---

### 🧪 Testing

| Guía | Duración | Objetivo |
|------|----------|----------|
| [Testing Guide](./TESTING.md) | 20 min | TDD, Vitest, patrones de testing |

**En esta guía aprenderás:**
- ✅ Configurar Vitest con React
- ✅ Escribir tests unitarios e integración
- ✅ Usar mocks desde `test/setup.ts`
- ✅ Coverage reports
- ✅ Debugging de tests

**Quick Commands:**
```bash
npm run test              # Ejecutar todos los tests
npm run test:ui          # UI interactivo
npm run test:watch       # Watch mode
npm run test:coverage    # Generar reporte
```

---

### 🎨 Diseño & Componentes

| Guía | Duración | Objetivo |
|------|----------|----------|
| [Style Guide](./style-guide.md) | 15 min | Componentes, colores, tipografía |

---

### 🚀 Deployment

| Guía | Duración | Objetivo |
|------|----------|----------|
| [Deployment Guide](./DEPLOYMENT.md) | 20 min | Deploy a Cloudflare, Vercel, etc |

**Quick Deploy:**
```bash
# Cloudflare Workers
npm run deploy:cf:prod

# Build para producción
npm run build && npm run preview
```

---

## 🏗️ Estructura del Proyecto

```
MyGrowthSpace/
├── 📚 docs/                    ← ¡ESTÁS AQUÍ!
│   ├── SUPABASE_QUICK_START.md    (15 min)
│   ├── SUPABASE_SETUP.md          (30 min)
│   ├── DATABASE_ARCHITECTURE.md   (20 min)
│   ├── DATABASE_SCHEMA.md         (10 min)
│   ├── SQL_QUERIES_REFERENCE.md   (referencia)
│   ├── AUTHENTICATION.md          (25 min)
│   ├── TESTING.md                 (20 min)
│   ├── style-guide.md             (15 min)
│   └── DEPLOYMENT.md              (20 min)
│
├── 🧪 test/                    ← TDD Test Suite
│   ├── setup.ts                (Mocks & fixtures)
│   ├── services/
│   │   └── geminiService.test.ts
│   ├── types.test.ts
│   └── integration/
│
├── 💾 services/                ← Business Logic
│   ├── supabaseClient.ts       (BD Sync)
│   └── geminiService.ts        (IA Analysis)
│
├── 🎨 components/              ← React Components
│   ├── HabitCard.tsx
│   ├── Onboarding.tsx
│   └── SuggestedCardComponent.tsx
│
├── 📋 types.ts                 ← Type Definitions
├── 🎯 App.tsx                  ← Main App
├── 📝 index.tsx                ← Entry Point
├── ⚙️ vite.config.ts            ← Build Config
├── 🧪 vitest.config.ts         ← Test Config
├── 🚀 wrangler.toml            ← Cloudflare Config
├── 📦 package.json             ← Dependencies
├── schema.sql                  ← Database Schema
└── .env.local.example          ← Environment Template
```

---

## 🎯 Flujo de Trabajo Recomendado

### Día 1: Setup
1. Leer [README.md](../README.md) (overview)
2. Ejecutar [SUPABASE_QUICK_START.md](./SUPABASE_QUICK_START.md)
3. Verificar que `npm run dev` funciona

### Día 2: Autenticación
1. Leer [AUTHENTICATION.md](./AUTHENTICATION.md)
2. Implementar componentes de auth
3. Crear usuario de prueba
4. Tests de auth

### Día 3+: Desarrollo
1. Usar [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) como referencia
2. Copiar queries desde [SQL_QUERIES_REFERENCE.md](./SQL_QUERIES_REFERENCE.md)
3. Escribir tests (ver [TESTING.md](./TESTING.md))
4. Leer [style-guide.md](./style-guide.md) para componentes

### Pre-Deploy
1. Leer [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Ver [wrangler.toml](../wrangler.toml) para Cloudflare
3. Ejecutar `npm run test:coverage`
4. Build: `npm run build && npm run preview`

---

## 📚 Recursos Externos

### Frameworks & Libraries
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Supabase & PostgreSQL
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Testing
- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Jest Matchers](https://jestjs.io/docs/expect)

### AI & Gemini
- [Google Generative AI](https://ai.google.dev/)
- [Gemini API Reference](https://ai.google.dev/api/)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)

### Deployment
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

## 🤔 Preguntas Frecuentes

### P: ¿Por dónde empiezo?
**R:** Comienza con [SUPABASE_QUICK_START.md](./SUPABASE_QUICK_START.md) (15 min), luego [README.md](../README.md).

### P: ¿Necesito una base de datos?
**R:** No es obligatorio. Puedes usar localStorage. Pero Supabase es gratuito y recomendado para multi-device sync.

### P: ¿Cómo agrego autenticación?
**R:** Lee [AUTHENTICATION.md](./AUTHENTICATION.md) - hay código ready-to-use.

### P: ¿Cómo hago tests?
**R:** Lee [TESTING.md](./TESTING.md) y revisa los ejemplos en `/test`.

### P: ¿Cómo deploy a producción?
**R:** Sigue [DEPLOYMENT.md](./DEPLOYMENT.md) para Cloudflare o tu plataforma preferida.

---

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/naiam-studio/MyGrowthSpace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/naiam-studio/MyGrowthSpace/discussions)
- **Email**: support@naiam-studio.com

---

## ✅ Checklist de Onboarding

- [ ] Leí [README.md](../README.md)
- [ ] Seguí [SUPABASE_QUICK_START.md](./SUPABASE_QUICK_START.md)
- [ ] Ejecuté `npm run dev` exitosamente
- [ ] Leí [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- [ ] Leí [AUTHENTICATION.md](./AUTHENTICATION.md)
- [ ] Leí [TESTING.md](./TESTING.md)
- [ ] Entiendo la estructura en `/components`, `/services`, `/test`
- [ ] Puedo hacer un primer cambio y pasar tests

---

## 🎓 Roadmap de Aprendizaje Sugerido

```
Día 1 (1h):     Setup → Dev Environment ✅
Día 2 (2h):     Auth → Login/Register Features
Día 3 (3h):     Hábitos → CRUD Operations
Día 4 (2h):     Testing → Write Tests
Día 5 (2h):     UI/UX → Componentes Visuales
Día 6 (2h):     AI → Integración Gemini
Día 7 (2h):     Deploy → Production Ready
```

---

<div align="center">

**¡Bienvenido a My Growth Space!** 🚀

*"We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle*

[⭐ Star on GitHub](https://github.com/naiam-studio/MyGrowthSpace) if helpful!

</div>
